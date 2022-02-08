import { Program } from "@project-serum/anchor";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { Cronos } from "../idl";
import { Account } from "../account";

export type DaemonCreateArgs = {
  owner: PublicKey;
};

export class DaemonCreate {
  private account: Account;
  private cronos: Program<Cronos>;

  constructor(account: Account, cronos: Program<Cronos>) {
    this.account = account;
    this.cronos = cronos;
  }

  public async daemonCreate({
    owner,
  }: DaemonCreateArgs): Promise<TransactionInstruction> {
    const daemonPDA = await this.account.daemon.pda(owner);
    return this.cronos.instruction.daemonCreate(daemonPDA.bump, {
      accounts: {
        daemon: daemonPDA.address,
        owner: owner,
        systemProgram: SystemProgram.programId,
      },
    });
  }
}