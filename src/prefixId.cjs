const utils = require('./random.cjs');

function generatePrefixId(
    prefix, 
    length = 20,
    delimiter = '-',
    options = { upper: true, numbers: false, specials: false }
) {
    let randString = utils.randomString(
        length, 
        { upper: options.upper, numbers: options.numbers, specials: options.specials }
    );
    
    return `${prefix}${delimiter}${randString}`;
}

module.exports = {
    generatePrefixId
}