var CONTRACT_NAME = 'eosio.token';
var ORE_CPU_ACCOUNT_NAME = 'cpu.ore';
var TOKEN_SYMBOL = 'CPU';
var amount;
/* Public */
function cpuContract(accountName) {
    return this.contract(CONTRACT_NAME, accountName);
}
function issueCpu(toAccountName, cpuAmount, memo) {
    if (memo === void 0) { memo = ""; }
    amount = this.getTokenAmount(cpuAmount, TOKEN_SYMBOL);
    return this.issueStandardToken(toAccountName, amount, memo, ORE_CPU_ACCOUNT_NAME, CONTRACT_NAME);
}
function approveCpu(fromAccountName, toAccountName, cpuAmount) {
    amount = this.getTokenAmount(cpuAmount, TOKEN_SYMBOL);
    return this.approveStandardTokenTransfer(fromAccountName, toAccountName, amount, CONTRACT_NAME);
}
function getCpuBalance(oreAccountName) {
    return this.getStandardTokenBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
}
function transferCpu(fromAccountName, toAccountName, cpuAmount, memo) {
    if (memo === void 0) { memo = ""; }
    amount = this.getTokenAmount(cpuAmount, TOKEN_SYMBOL);
    return this.transferStandardToken(fromAccountName, toAccountName, amount, memo, CONTRACT_NAME);
}
function transferCpufrom(approvedAccountName, fromAccountName, toAccountName, cpuAmount) {
    amount = this.getTokenAmount(cpuAmount, TOKEN_SYMBOL);
    return this.transferfrom(approvedAccountName, fromAccountName, toAccountName, amount, CONTRACT_NAME);
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