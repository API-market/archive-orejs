var CONTRACT_NAME = 'ore.ore';
/* Public */
function oreContract(accountName) {
    return this.contract(CONTRACT_NAME, accountName);
}
function approveOre(fromAccountName, toAccountName, cpuAmount) {
    return this.approveTransfer(fromAccountName, toAccountName, cpuAmount, CONTRACT_NAME);
}
function getOreBalance(oreAccountName) {
    return this.getBalance(oreAccountName, CONTRACT_NAME);
}
function transferOre(fromAccountName, toAccountName, amount) {
    return this.transferToken(fromAccountName, toAccountName, amount, CONTRACT_NAME);
}
module.exports = {
    approveOre: approveOre,
    oreContract: oreContract,
    getOreBalance: getOreBalance,
    transferOre: transferOre
};
//# sourceMappingURL=ore.js.map