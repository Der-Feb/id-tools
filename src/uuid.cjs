// UUID generation and validation
let _nodeId = null;
let _clockSeq = null;
let _lastMs = 0;
let _lastNs = 0;

// Namespaces for UUID v3 and v5
const NAMESPACES = {
    DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8'
};

function cryptoRandomBytes(size) {
    try {
        const crypto = require('crypto');
        return crypto.randomBytes(size);
    } catch (e) {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const bytes = new Uint8Array(size);
            crypto.getRandomValues(bytes);
            return bytes;
        }
        const bytes = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
        return bytes;
    }
}

function getNodeId() {
    if (!_nodeId) {
        _nodeId = new Uint8Array(6);
        const bytes = cryptoRandomBytes(6);
        for (let i = 0; i < 6; i++) {
            _nodeId[i] = bytes[i];
        }
        // Set multicast bit as per RFC 4122
        _nodeId[0] |= 0x01;
    }
    return _nodeId;
}

function getClockSeq() {
    if (!_clockSeq) {
        const bytes = cryptoRandomBytes(2);
        _clockSeq = ((bytes[0] & 0x3f) << 8) | bytes[1];
    }
    return _clockSeq;
}

function stringToBytes(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

function uuidToBytes(uuid) {
    const hex = uuid.replace(/-/g, '');
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, (i + 1) * 2), 16);
    }
    return bytes;
}

function bytesToUuid(bytes) {
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function computeHash(algorithm, data) {
    try {
        // Try Node.js crypto
        const crypto = require('crypto');
        return crypto.createHash(algorithm).update(data).digest();
    } catch (e) {
        // Try Web Crypto API
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase(), data);
            return new Uint8Array(hashBuffer);
        }
        throw new Error('No crypto API available');
    }
}

function generateUuidV1() {
    const now = Date.now();
    let ns = _lastNs;

    if (now === _lastMs) {
        ns++;
        if (ns > 9999) {
            // Wait for next millisecond
            while (Date.now() === _lastMs) {}
            ns = 0;
        }
    } else {
        ns = 0;
    }

    _lastMs = now;
    _lastNs = ns;

    // UUID epoch is 15 October 1582 00:00:00.00 UTC
    const uuidTime = (now * 10000) + 122192928000000000 + ns;

    const bytes = new Uint8Array(16);
    const timeLow = uuidTime & 0xffffffff;
    const timeMid = (uuidTime >> 32) & 0xffff;
    const timeHiAndVersion = ((uuidTime >> 48) & 0x0fff) | (0x1000);

    const clockSeq = getClockSeq();
    const clockSeqLow = clockSeq & 0xff;
    const clockSeqHiAndReserved = ((clockSeq >> 8) & 0x3f) | 0x80;

    const node = getNodeId();

    bytes[0] = (timeLow >> 24) & 0xff;
    bytes[1] = (timeLow >> 16) & 0xff;
    bytes[2] = (timeLow >> 8) & 0xff;
    bytes[3] = timeLow & 0xff;
    bytes[4] = (timeMid >> 8) & 0xff;
    bytes[5] = timeMid & 0xff;
    bytes[6] = (timeHiAndVersion >> 8) & 0xff;
    bytes[7] = timeHiAndVersion & 0xff;
    bytes[8] = clockSeqHiAndReserved;
    bytes[9] = clockSeqLow;
    bytes.set(node, 10);

    return bytesToUuid(bytes);
}

function generateUuidV4() {
    const bytes = cryptoRandomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 1
    return bytesToUuid(bytes);
}

async function generateUuidV3(name, namespace) {
    const namespaceBytes = uuidToBytes(namespace);
    const nameBytes = typeof name === 'string' ? stringToBytes(name) : name;
    const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
    data.set(namespaceBytes);
    data.set(nameBytes, namespaceBytes.length);
    const hash = await computeHash('md5', data);
    const bytes = hash.slice(0, 16);
    bytes[6] = (bytes[6] & 0x0f) | 0x30; // Version 3
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 1
    return bytesToUuid(bytes);
}

async function generateUuidV5(name, namespace) {
    const namespaceBytes = uuidToBytes(namespace);
    const nameBytes = typeof name === 'string' ? stringToBytes(name) : name;
    const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
    data.set(namespaceBytes);
    data.set(nameBytes, namespaceBytes.length);
    const hash = await computeHash('sha1', data);
    const bytes = hash.slice(0, 16);
    bytes[6] = (bytes[6] & 0x0f) | 0x50; // Version 5
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 1
    return bytesToUuid(bytes);
}


function generateUuid(version = 4, options = {}) {
    switch (version) {
        case 1:
            return generateUuidV1();
        case 3:
            if (!options.name || !options.namespace) {
                throw new Error('Name and namespace are required for UUID v3');
            }
            return generateUuidV3(options.name, options.namespace);
        case 4:
            return generateUuidV4();
        case 5:
            if (!options.name || !options.namespace) {
                throw new Error('Name and namespace are required for UUID v5');
            }
            return generateUuidV5(options.name, options.namespace);
        default:
            throw new Error('Version must be 1, 3, 4, or 5');
    }
}

function isValidUuid(id, options = { upper: false, checkVersion: false, version: 4, strictLength: false }) {
    const { upper, checkVersion, version, strictLength } = options;
    if (typeof id !== 'string') return false;
    if (strictLength && id.length !== 36) return false;
    if (upper && id.toLowerCase() !== id) return false;

    // General UUID regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) return false;

    if (checkVersion) {
        const versionChar = id.charAt(14);
        const actualVersion = parseInt(versionChar, 16);
        if (actualVersion !== version) return false;
    }

    return true;
}

module.exports = {
    generateUuid,
    generateUuidV1,
    generateUuidV3,
    generateUuidV4,
    generateUuidV5,
    isValidUuid,
    NAMESPACES
};
