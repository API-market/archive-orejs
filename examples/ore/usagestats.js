let orejs = require("../index").orejs()

;(async function () {
    const totalUsage = await orejs.getRightStats("io.hadron.contest-2018-07")
    console.log(totalUsage)

    // Cpu usage and api call cpunt for a particular owner
    const usageByOwner = await orejs.getRightStats("io.hadron.contest-2018-07", process.ORE_TESTB_ACCOUNT_NAME)
    console.log(usageByOwner)

})()