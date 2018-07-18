var CONTRACT_NAME = 'cpu.ore';
var TOKEN_SYMBOL = 'CPU';
/* Public */
function cpuContract(accountName) {
    return this.contract(CONTRACT_NAME, accountName);
}
function approveCpu(fromAccountName, toAccountName, cpuAmount) {
    return this.approveStandardTokenTransfer(fromAccountName, toAccountName, cpuAmount, CONTRACT_NAME);
}
function getCpuBalance(oreAccountName) {
    return this.getStandardTokenBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
}
function transferCpu(fromAccountName, toAccountName, cpuAmount, memo) {
    if (memo === void 0) { memo = ""; }
    return this.transferStandardToken(fromAccountName, toAccountName, cpuAmount, memo, CONTRACT_NAME);
}
module.exports = {
    approveCpu: approveCpu,
    cpuContract: cpuContract,
    getCpuBalance: getCpuBalance,
    transferCpu: transferCpu
};
//# sourceMappingURL=cpu.js.map