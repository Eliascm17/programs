!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("@project-serum/anchor"),require("@faktorfi/utils"),require("@solana/web3.js")):"function"==typeof define&&define.amd?define(["exports","@project-serum/anchor","@faktorfi/utils","@solana/web3.js"],e):e((t||self).listProgram={},t.anchor,t.utils,t.web3_js)}(this,function(t,e,r,n){function i(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,o(t,e)}function o(t,e){return o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},o(t,e)}var s=Buffer.from("lst"),a=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}return i(e,t),e.prototype.pda=function(t,e){try{return Promise.resolve(r.findPDA([s,t.toBuffer(),e.toBuffer()],this.program.programId))}catch(t){return Promise.reject(t)}},e}(r.Gateway),u=Buffer.from("elm"),c=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}return i(e,t),e.prototype.pda=function(t,e){try{return Promise.resolve(r.findPDA([u,t.toBuffer(),e.toArrayLike(Buffer,"be",16)],this.program.programId))}catch(t){return Promise.reject(t)}},e}(r.Gateway),m=function(t){this.element=void 0,this.list=void 0,this.element=new c(t,t.account.element),this.list=new a(t,t.account.list)},p=/*#__PURE__*/function(){function t(t,e){this.account=void 0,this.program=void 0,this.account=t,this.program=e}return t.prototype.createList=function(t){var e=t.namespace,r=t.owner,i=t.payer;try{var o=this;return Promise.resolve(o.account.list.pda(r,e)).then(function(t){return o.program.instruction.createList(t.bump,{accounts:{list:t.address,namespace:e,owner:r,payer:i,systemProgram:n.SystemProgram.programId}})})}catch(t){return Promise.reject(t)}},t}(),l=/*#__PURE__*/function(){function t(t,e){this.account=void 0,this.program=void 0,this.account=t,this.program=e}return t.prototype.deleteList=function(t){var e=t.list;try{var r=this;return Promise.resolve(r.account.list.data(e)).then(function(t){return r.program.instruction.deleteList({accounts:{list:e,owner:t.owner}})})}catch(t){return Promise.reject(t)}},t}(),h=/*#__PURE__*/function(){function t(t,e){this.account=void 0,this.program=void 0,this.account=t,this.program=e}return t.prototype.pushElement=function(t){var e=t.list,r=t.owner,i=t.value;try{var o=this;return Promise.resolve(o.account.list.data(e)).then(function(t){return Promise.resolve(o.account.element.pda(e,t.count)).then(function(t){return o.program.instruction.pushElement(i,t.bump,{accounts:{list:e,element:t.address,owner:r,payer:r,systemProgram:n.SystemProgram.programId}})})})}catch(t){return Promise.reject(t)}},t}(),f=/*#__PURE__*/function(){function t(t,e){this.account=void 0,this.program=void 0,this.account=t,this.program=e}return t.prototype.popElement=function(t){var r=t.list;try{var n=this;return Promise.resolve(n.account.list.data(r)).then(function(t){return Promise.resolve(n.account.element.pda(r,t.count.sub(new e.BN(1)))).then(function(e){return n.program.instruction.popElement({accounts:{list:r,element:e.address,owner:t.owner}})})})}catch(t){return Promise.reject(t)}},t}(),d=function(t,e){this.account=void 0,this.program=void 0,this.createList=void 0,this.deleteList=void 0,this.pushElement=void 0,this.popElement=void 0,this.account=t,this.program=e,this.createList=new p(t,e).createList,this.deleteList=new l(t,e).deleteList,this.popElement=new f(t,e).popElement,this.pushElement=new h(t,e).pushElement},g={version:"0.0.3",name:"list_program",instructions:[{name:"createList",accounts:[{name:"list",isMut:!0,isSigner:!1},{name:"namespace",isMut:!1,isSigner:!1},{name:"owner",isMut:!0,isSigner:!0},{name:"payer",isMut:!0,isSigner:!0},{name:"systemProgram",isMut:!1,isSigner:!1}],args:[{name:"bump",type:"u8"}]},{name:"deleteList",accounts:[{name:"list",isMut:!0,isSigner:!1},{name:"owner",isMut:!0,isSigner:!0}],args:[]},{name:"popElement",accounts:[{name:"list",isMut:!0,isSigner:!1},{name:"owner",isMut:!0,isSigner:!0},{name:"element",isMut:!0,isSigner:!1}],args:[]},{name:"pushElement",accounts:[{name:"list",isMut:!0,isSigner:!1},{name:"owner",isMut:!0,isSigner:!0},{name:"payer",isMut:!0,isSigner:!0},{name:"element",isMut:!0,isSigner:!1},{name:"systemProgram",isMut:!1,isSigner:!1}],args:[{name:"value",type:"publicKey"},{name:"bump",type:"u8"}]}],accounts:[{name:"element",type:{kind:"struct",fields:[{name:"index",type:"u128"},{name:"value",type:"publicKey"},{name:"bump",type:"u8"}]}},{name:"list",type:{kind:"struct",fields:[{name:"owner",type:"publicKey"},{name:"namespace",type:"publicKey"},{name:"count",type:"u128"},{name:"bump",type:"u8"}]}}]},y="DBMi4GBjiX15vCMVj93uB7JYM9LU6rCaZJraVKM6XgZi",v=function(t){this.account=void 0,this.instruction=void 0;var r=new e.Program(g,y,t),n=new m(r),i=new d(n,r);this.account=n,this.instruction=i};v.programId=y,t.ListProgram=v,t.PROGRAM_ID=y});
//# sourceMappingURL=faktorfi-list-program.umd.js.map