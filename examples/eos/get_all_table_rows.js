const {getAllTableRows} = require("../../src/eos.js");

(async function() {
    var result = await getAllTableRowsFiltered({
        code: "ore.instr",
        scope: "ore.instr", //optional, defaults to same value as code
        table: "tokens",
    }, {owner:"apiowner"});

    console.log(result);
})()
