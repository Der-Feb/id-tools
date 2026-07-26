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

// MongoDB ID <-> UUID conversion
function mongoIdToBytes(id) {
    if (id.length !== 24) throw new Error("Invalid MongoDB ID");
    let bytes = new Uint8Array(12);
    for (let i = 0; i < 12; i++) {
        bytes[i] = parseInt(id.slice(i * 2, (i + 1) * 2), 16);
    }
    return bytes;
}

function bytesToMongoId(bytes) {
    if (bytes.length !== 12) throw new Error("Invalid bytes length");
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function mongoIdToUuid(id) {
    const mongoBytes = mongoIdToBytes(id);
    // Pad with 4 random bytes to make 16 bytes
    const uuidBytes = new Uint8Array(16);
    uuidBytes.set(mongoBytes, 0);
    for (let i = 12; i < 16; i++) {
        uuidBytes[i] = Math.floor(Math.random() * 256);
    }
    // Set UUID version (4) and variant
    uuidBytes[6] = (uuidBytes[6] & 0x0f) | 0x40;
    uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80;
    const hex = Array.from(uuidBytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidToMongoId(uuid) {
    const hex = uuid.replace(/-/g, '');
    if (hex.length !== 32) throw new Error("Invalid UUID");
    // Take first 24 hex chars (12 bytes)
    return hex.slice(0, 24);
}

function mongoIdTimestamp(id) {
    const tsHex = id.slice(0, 8);
    return parseInt(tsHex, 16) * 1000;
}

module.exports = {
    generateMongoID,
    isMongoID,
    mongoIdToUuid,
    uuidToMongoId
}
