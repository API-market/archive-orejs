var CONTRACT_NAME = 'cpu.ore';
var ORE_CPU_ACCOUNT_NAME = 'cpu.ore';
var TOKEN_SYMBOL = 'CPU';
/* Public */
function cpuContract(accountName) {
    return this.contract(CONTRACT_NAME, accountName);
}
function issueCpu(toAccountName, cpuAmount, memo) {
    if (memo === void 0) { memo = ""; }
    return this.issueStandardToken(toAccountName, cpuAmount, memo, ORE_CPU_ACCOUNT_NAME, CONTRACT_NAME);
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
function transferCpufrom(approvedAccountName, fromAccountName, toAccountName, cpuAmount) {
    return this.transferfrom(approvedAccountName, fromAccountName, toAccountName, cpuAmount, CONTRACT_NAME);
}
module.exports = {
    issueCpu: issueCpu,
    approveCpu: approveCpu,
    cpuContract: cpuContract,
    getCpuBalance: getCpuBalance,
    transferCpu: transferCpu,
    transferCpufrom: transferCpufrom
};
//# sourceMappingURL=cpu.js.map