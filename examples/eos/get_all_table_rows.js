const {getAllTableRows} = require("../../src/eos.js");

(async function() {
    var result = await getAllTableRows({
        code: "ore.instr",
        scope: "ore.instr",
        table: "tokens",
        filter: {owner: "apiuser"}
    });

    console.log(result);
})()
