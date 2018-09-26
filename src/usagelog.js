const INSTR_CONTRACT_NAME = 'instr.ore';
const INSTR_USAGE_CONTRACT_NAME = 'usagelog.ore';
const INSTR_TABLE_NAME = 'tokensv2';
const LOG_COUNT_TABLE_NAME = 'counts';

/* Private */

async function getInstrumentsByRight(instrumentList, rightName) {
  // Gets all the instruments with a particular right
  const instruments = await instrumentList.filter(instrument => this.getRight(instrument, rightName) !== undefined);
  return instruments;
}

async function getInstrumentByOwner(owner) {
  const instruments = await this.findInstruments(owner);
  return instruments;
}

/* Public */

async function getApiCallStats(instrumentId, rightName) {
  // calls the usagelog contract to get the total number of calls against a particular right
  const result = await this.eos.getTableRows({
    code: INSTR_USAGE_CONTRACT_NAME,
    json: true,
    scope: instrumentId,
    table: LOG_COUNT_TABLE_NAME,
    limit: -1,
  });

  const rightProperties = {
    totalApiCalls: 0,
    totalCpuUsage: 0,
  };

  const rightObject = await result.rows.find(right => right.right_name === rightName);

  if (rightObject !== undefined) {
    rightProperties.totalApiCalls = rightObject.total_count;
    rightProperties.totalCpuUsage = rightObject.total_cpu;
  }

  return rightProperties;
}

async function getRightStats(rightName, owner) {
  // Returns the total cpu and api calls against a particular right across all the vouchers. If owner specified, then returns the toatal api calls and cpu usage for the owner.
  let instruments;
  let rightProperties;

  if (owner) {
    instruments = await getInstrumentByOwner.bind(this)(owner);
  } else {
    instruments = await this.getAllTableRows({
      code: INSTR_CONTRACT_NAME,
      scope: INSTR_CONTRACT_NAME,
      table: INSTR_TABLE_NAME,
      limit: -1,
    });
  }

  instruments = await getInstrumentsByRight.bind(this)(instruments, rightName);

  // Get the total cpu calls and cpu count across all the instruments
  const results = instruments.map(async (instrumentObject) => {
    rightProperties = await getApiCallStats.bind(this)(instrumentObject.id, rightName);
    return rightProperties;
  });

  const value = await Promise.all(results);

  return {
    totalCpuUsage: value.reduce((a, b) => a + parseFloat(b.totalCpuUsage), 0),
    totalApiCalls: value.reduce((a, b) => a + parseFloat(b.totalApiCalls), 0),
  };
}

module.exports = {
  getApiCallStats,
  getRightStats,
  getInstrumentsByRight,
};