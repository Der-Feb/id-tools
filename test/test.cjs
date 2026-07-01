const test = require("../index.cjs");

var idByFormatTest = test.idByFormat('xxx-nnn-xxx-nnn-sss');
console.log("Random id by format", idByFormatTest);
//output: Random id by format aid-179-tui-711-{[[

var randomIntegerTest = test.randomInteger(1, 4);
console.log("Random Number", randomIntegerTest);

var randomLetterTest = test.randomLetter(true);
console.log("Random Letter", randomLetterTest);