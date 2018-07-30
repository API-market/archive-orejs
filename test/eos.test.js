const { Orejs } = require("../src")
const { mockBlock, mockInfo } = require("./helpers/fetch")

describe("token", () => {
  let orejs, oreAccountName

  beforeAll(() => {
    dotenv.config()

    oreAccountName = process.env.ORE_TESTA_ACCOUNT_NAME

    fetch.mockResponses(mockInfo())

    orejs = new Orejs({
      httpEndpoint: process.env.ORE_NETWORK_URI,
      keyProvider: [process.env.ORE_OWNER_ACCOUNT_KEY],
      orePayerAccountName: process.env.ORE_PAYER_ACCOUNT_NAME,
      sign: true
    })
  })

  /*
  / eosjs only confirms that transactions have been accepted
  // this confirms that the transaction has been written to the chain
  // by checking block produced immediately after the transaction
  async function confirmTransaction(func, blocksToCheck = 10, checkInterval = 200) {
    // before making the transaction, check the current block id...
    let latestBlock = await this.getLatestBlock()
    let initialBlockId = latestBlock.block_num
    // make the transaction...
    let transaction = await func()
    // check blocks for the transaction id...
    return new Promise((resolve, reject) => {
      let currentBlockId = initialBlockId + 1
      let intConfirm = setInterval(async() => {
        let latestBlock = await this.getLatestBlock()
        if (currentBlockId <= latestBlock.block_num) {
          if (currentBlockId != latestBlock.block_num) {
            latestBlock = this.eos.getBlock(currentBlockId)
          }
          currentBlockId += 1
        }
        if (hasTransaction(latestBlock, transaction.transaction_id)) {
          clearInterval(intConfirm)
          resolve(transaction)
        } else if (latestBlock.block_num >= initialBlockId + blocksToCheck) {
          clearInterval(intConfirm)
          reject("Transaction Confirmation Timeout")
        }
      }, checkInterval)
    })
  }

  async function contract(contractName, accountName) {
    let options = {authorization: `${accountName}@active`}
    let contract = await this.eos.contract(contractName, options)
    return { contract, options }
  }

  // Find one row in a table
  async function findOne(contractName, tableName, tableKey) {
    let results = await this.eos.getTableRows({
      code: contractName.toString(),
      json: true,
      limit: 1,
      lower_bound: tableKey.toString(),
      scope: contractName.toString(),
      table: tableName.toString(),
      upper_bound: tableKey.plus(1).toString()
    })
    return results.rows[0]
  }

  async function getAllTableRows(params, key_field="id") {
    let more = true
    let results = []
    let lower_bound = 0

    do {
      let result = await getTableRowsPage.bind(this)(params, lower_bound)
      more = result.more

      if (more) {
        let last_key_value = result.rows[result.rows.length - 1][key_field]

        //if it's an account_name convert it to its numeric representation
        if (isNaN(last_key_value)) {
          last_key_value = tableKey(last_key_value)
        }

        lower_bound = (new BigNumber(last_key_value)).plus(1).toFixed()
      }

      results = results.concat(result.rows)
    } while(more)

    return results
  }

  async function getAllTableRowsFiltered(params, filter, key_field="id") {
    let result = await getAllTableRows.bind(this)(params, key_field)

    return filterRows(result, filter)
  }

  async function getLatestBlock() {
    let info = await this.eos.getInfo({})
    let block = await this.eos.getBlock(info.last_irreversible_block_num)
    return block
  }
  */

  describe("getLatestBlock", () => {
    let block

    beforeEach(() => {
      block = mockBlock()

      fetch.mockResponses(
        mockInfo(),
        block
      )
    })

    test("returns the latest block", async () => {
      const blockNum = await orejs.getLatestBlock()
      expect(JSON.stringify(blockNum)).toEqual(block[0])
    })
  })

  describe("hasTransaction", () => {
    let block, transactionId, transaction

    beforeAll(() => {
      transactionId = "asdf"
      transaction = {trx: {id: transactionId}}
    })

    describe("when the block includes the transaction", () => {

      beforeAll(() => {
        block = {transactions: [transaction]}
      })

      test("returns true", () => {
        const hasTransaction = orejs.hasTransaction(block, transactionId)
        expect(hasTransaction).toEqual(true)
      })
    })

    describe("when the block does not include the transaction", () => {

      beforeAll(() => {
        block = {transactions: []}
      })

      test("returns false", () => {
        const hasTransaction = orejs.hasTransaction(block, transactionId)
        expect(hasTransaction).toEqual(false)
      })
    })
  })

  describe("signVoucher", () => {
    test("signs a voucher", async () => {
      const voucherId = 0
      const sig = await orejs.signVoucher(voucherId)
      expect(sig.toString()).toEqual("SIG_K1_K1AZ8PG9tfgXFrKBTup7UgDsNcnXvwF3JbGbBC9Em38ptJTNoVMH91AmfMYx3BFLrKNAFFEmzAfJnGuYUj8uevPXqEv3bJ")
    })
  })

  describe("tableKey", () => {
    let encodedAccountName

    beforeAll(() => {
      encodedAccountName = orejs.tableKey(oreAccountName)
    })

    test("returns a number", () => {
      expect(encodedAccountName.toString()).toEqual("14605613949550624768")
    })

    test("returns a BigNumber", () => {
      expect(encodedAccountName.plus(1).toString()).toEqual("14605613949550624769")
    })
  })
})
