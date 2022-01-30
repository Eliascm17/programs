use {
    crate::{errors::*, state::*},
    anchor_lang::prelude::*,
    solana_program::system_program,
    std::mem::size_of,
};

#[derive(Accounts)]
#[instruction(
    next_task_bump: u8,
    next_task_element_bump: u8
)]
pub struct TaskRepeat<'info> {
    #[account(
        mut,
        seeds = [SEED_AUTHORITY],
        bump = authority.bump,
        owner = crate::ID
    )]
    pub authority: Account<'info, Authority>,

    #[account(
        mut,
        seeds = [
            SEED_DAEMON, 
            daemon.owner.key().as_ref()
        ],
        bump = daemon.bump,
        owner = crate::ID
    )]
    pub daemon: Account<'info, Daemon>,

    #[account(address = list_program::ID)]
    pub list_program: Program<'info, list_program::program::ListProgram>,

    #[account(
        seeds = [
            SEED_FRAME, 
            next_frame.timestamp.to_be_bytes().as_ref()
        ],
        bump = next_frame.bump,
        constraint = next_frame.timestamp == prev_task.execute_at.checked_add(prev_task.repeat_every).unwrap(),
        owner = crate::ID
    )]
    pub next_frame: Account<'info, Frame>,

    #[account(
        init,
        seeds = [
            SEED_TASK,
            daemon.key().as_ref(),
            daemon.total_task_count.to_be_bytes().as_ref(),
        ],
        bump = next_task_bump,
        payer = worker,
        space = 8 + size_of::<Task>() + std::mem::size_of_val(&prev_task.instruction_data),
    )]
    pub next_task: Account<'info, Task>,

    #[account(mut)]
    pub next_task_element: AccountInfo<'info>,

    #[account(
        mut,
        constraint = next_task_list.namespace == next_frame.key(),
        owner = list_program::ID
    )]
    pub next_task_list: Account<'info, list_program::state::List>,

    #[account(
        mut,
        seeds = [
            SEED_TASK, 
            prev_task.daemon.as_ref(),
            prev_task.id.to_be_bytes().as_ref(),
        ],
        bump = prev_task.bump,
        has_one = daemon,
        constraint = prev_task.status == TaskStatus::Repeat @ ErrorCode::TaskNotRepeatable,
        owner = crate::ID
    )]
    pub prev_task: Account<'info, Task>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,

    #[account()]
    pub worker: Signer<'info>,
}

pub fn handler(
    ctx: Context<TaskRepeat>, 
    next_task_bump: u8, 
    next_task_element_bump: u8
) -> ProgramResult {
    // Get accounts.
    let authority = &ctx.accounts.authority;
    let daemon = &mut ctx.accounts.daemon;
    let list_program = &ctx.accounts.list_program;
    let next_task = &mut ctx.accounts.next_task;
    let next_task_element = &ctx.accounts.next_task_element;
    let next_task_list = &ctx.accounts.next_task_list;
    let prev_task = &mut ctx.accounts.prev_task;
    let system_program = &ctx.accounts.system_program;
    let worker = &ctx.accounts.worker;

    // Initialize next_task account
    next_task.daemon = prev_task.daemon;
    next_task.id = daemon.total_task_count;
    next_task.instruction_data = prev_task.instruction_data.clone();
    next_task.status = TaskStatus::Pending;
    next_task.execute_at = prev_task.execute_at.checked_add(prev_task.repeat_every).unwrap();
    next_task.repeat_every = prev_task.repeat_every;
    next_task.repeat_until = prev_task.repeat_until;
    next_task.bump = next_task_bump;
    
    // Mark previous task as done.
    prev_task.status = TaskStatus::Done;

    // Increment daemon total task count.
    daemon.total_task_count = daemon.total_task_count.checked_add(1).unwrap();
    
    // Push next task into frame for execution.
    list_program::cpi::push_element(
        CpiContext::new_with_signer(
            list_program.to_account_info(), 
            list_program::cpi::accounts::PushElement {
                list: next_task_list.to_account_info(),
                element: next_task_element.to_account_info(),
                owner: authority.to_account_info(),
                payer: worker.to_account_info(),
                system_program: system_program.to_account_info(),
            },
            &[&[SEED_AUTHORITY, &[authority.bump]]]
        ), 
        next_task.key(),
        next_task_element_bump, 
    )?;

    // TODO pay out bounty to worker

    Ok(())
}