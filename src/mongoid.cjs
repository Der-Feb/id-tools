function generateMongoID() {
    const timestamp = Math.floor(Date.now() / 1000);
    const tsHex = timestamp.toString(16).padStart(8, '0');

    let randomBytes = '';
    for (let i = 0; i < 5; i++) {
        randomBytes += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }

    let counter = '';
    for (let i = 0; i < 3; i++) {
        counter += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }

    return tsHex + randomBytes + counter;
}

function isMongoID(id, options = { upper: true, checkTimestamp: true, minTimestamp: 0, maxTimestamp: Math.floor(Date.now() / 1000) + 86400, strictLength: true, checkRandomPart: false }) {
    const { upper, checkTimestamp, minTimestamp, maxTimestamp, strictLength, checkRandomPart } = options;

    if (typeof id !== 'string') return false;

    if (strictLength && id.length !== 24) return false;

    const hexRegex = upper ? /^[0-9a-fA-F]{24}$/ : /^[0-9a-f]{24}$/;
    if (!hexRegex.test(id)) return false;

    if (checkTimestamp) {
        const tsHex = id.slice(0, 8);
        const timestamp = parseInt(tsHex, 16);
        if (isNaN(timestamp)) return false;
        if (timestamp < minTimestamp || timestamp > maxTimestamp) return false;
    }

    if (checkRandomPart) {
        const randomPart = id.slice(8);
        if (/^0+$/.test(randomPart)) return false;
    }

    return true;
}

module.exports = {
    generateMongoID,
    isMongoID
}
