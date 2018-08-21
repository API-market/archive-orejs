var CONTRACT_NAME = 'token.ore';
var ORE_ORE_ACCOUNT_NAME = 'ore.ore';
var TOKEN_SYMBOL = 'ORE';
var amount;
/* Public */
function oreContract(accountName) {
    return this.contract(CONTRACT_NAME, accountName);
}
function issueOre(toAccountName, oreAmount, memo) {
    if (memo === void 0) { memo = ''; }
    amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
    return this.issueToken(toAccountName, amount, memo, ORE_ORE_ACCOUNT_NAME, CONTRACT_NAME);
}
function approveOre(fromAccountName, toAccountName, oreAmount) {
    amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
    return this.approveTransfer(fromAccountName, toAccountName, amount, CONTRACT_NAME);
}
function getOreBalance(oreAccountName) {
    return this.getBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
}
function transferOre(fromAccountName, toAccountName, oreAmount, memo) {
    if (memo === void 0) { memo = ''; }
    amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
    return this.transferToken(fromAccountName, toAccountName, amount, memo, CONTRACT_NAME);
}
function transferOrefrom(approvedAccountName, fromAccountName, toAccountName, oreAmount) {
    amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
    return this.transferFrom(approvedAccountName, fromAccountName, toAccountName, amount, CONTRACT_NAME);
}
module.exports = {
    issueOre: issueOre,
    approveOre: approveOre,
    oreContract: oreContract,
    getOreBalance: getOreBalance,
    transferOre: transferOre,
    transferOrefrom: transferOrefrom,
};
//# sourceMappingURL=ore.js.map