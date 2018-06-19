const {getAllTableRows} = require("../../src/eos.js");

(async function() {
    var result = await getAllTableRows("ore.instr", "ore.instr", "tokens", {owner: "apiowner"});

    console.log(result);
})()