const anchor = require('@project-serum/anchor');
const assert = require("assert");
const { SystemProgram } = anchor.web3;

describe('mysolanaapp', () => {
  /* Create and set a Provider */
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Mysolanaapp;
  let _baseAccount;

  it("Initialize data store", async () => {
    /* Call the create function via RPC */
    const baseAccount = anchor.web3.Keypair.generate();
    const testData = "Initialisation test";
    await program.rpc.initialize(testData, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    /* Fetch the data and check if matches the input */
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Data: ', account.data);
    console.log(`Data-List: ${account.dataList}`);
    assert.ok(account.data.toString() == testData);
    _baseAccount = baseAccount;
  });

  it("Update the data store", async () => {
    const baseAccount = _baseAccount;
    await program.rpc.update("2nd Input", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Data ', account.data);
    console.log('DataList ', account.dataList);
    assert.ok(account.data == "2nd Input");
  })
});
