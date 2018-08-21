const orejs = require('../index').orejs();

(async function () {
  const totalUsage = await orejs.getRightStats('cloud.hadron.contest-2018-07');
  console.log(totalUsage);

  // Cpu usage and api call count for a particular user
  const usageByOwner = await orejs.getRightStats('cloud.hadron.contest-2018-07', process.env.ORE_TESTB_ACCOUNT_NAME);
  console.log(usageByOwner);
}());