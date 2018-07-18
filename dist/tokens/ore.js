var CONTRACT_NAME = 'ore.ore';
var ORE_ORE_ACCOUNT_NAME = 'ore.ore';
var TOKEN_SYMBOL = 'ORE';
/* Public */
function oreContract(accountName) {
    return this.contract(CONTRACT_NAME, accountName);
}
function issueOre(toAccountName, oreAmount, memo) {
    if (memo === void 0) { memo = ""; }
    return this.issueStandardToken(toAccountName, oreAmount, memo, ORE_ORE_ACCOUNT_NAME, CONTRACT_NAME);
}
function approveOre(fromAccountName, toAccountName, oreAmount) {
    return this.approveStandardTokenTransfer(fromAccountName, toAccountName, oreAmount, CONTRACT_NAME);
}
function getOreBalance(oreAccountName) {
    return this.getStandardTokenBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
}
function transferOre(fromAccountName, toAccountName, oreAmount, memo) {
    if (memo === void 0) { memo = ""; }
    return this.transferStandardToken(fromAccountName, toAccountName, oreAmount, memo, CONTRACT_NAME);
}
function transferOrefrom(approvedAccountName, fromAccountName, toAccountName, oreAmount) {
    return this.transferfrom(approvedAccountName, fromAccountName, toAccountName, oreAmount, CONTRACT_NAME);
}
module.exports = {
    issueOre: issueOre,
    approveOre: approveOre,
    oreContract: oreContract,
    getOreBalance: getOreBalance,
    transferOre: transferOre,
    transferOrefrom: transferOrefrom
};
//# sourceMappingURL=ore.js.map