const crockfordBase32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function isValidUlid(ulid) {
	const regex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
	return regex.test(ulid);
}

function encodeTime(timestamp = Date.now()) {
	let ts = BigInt(timestamp);
	let result = "";

	for (let i = 9; i >= 0; i--) {
		const mod = ts % 32n;
		result = crockfordBase32[Number(mod)] + result;
		ts = ts / 32n;
	}

	return result;
}

function decodeUlid(ulid) {
	if (!isValidUlid(ulid)) throw new Error("Invalid ULID");
	let timestampPart = ulid.slice(0, 10);
	let ts = 0n;
	for (const char of timestampPart) {
		ts = (ts << 5n) + BigInt(crockfordBase32.indexOf(char));
	}
	return {
		timestamp: Number(ts),
		random: ulid.slice(10)
	};
}

function generateRandomPart(length = 16) {
	let result = "";
	for (let i = 0; i < length; i++) {
		const randIndex = Math.floor(Math.random() * 32);
		result += crockfordBase32[randIndex];
	}
	return result;
}

function generateUlid() {
	return encodeTime() + generateRandomPart();
}

function generateMonotonicUlid() {
	let lastTime = 0;
	let lastRandom = "";
	const now = Date.now();
	if (now === lastTime) {
		let chars = lastRandom.split("");
		for (let i = chars.length - 1; i >= 0; i--) {
			let idx = crockfordBase32.indexOf(chars[i]);
			if (idx < 31) {
				chars[i] = crockfordBase32[idx + 1];
				break;
			} else {
				chars[i] = crockfordBase32[0];
			}
		}
		lastRandom = chars.join("");
	} else {
		lastTime = now;
		lastRandom = generateRandomPart();
	}
	return encodeTime(now) + lastRandom;
}


//helper functions
function compareUlids(u1, u2) {
	if (!isValidUlid(u1) || !isValidUlid(u2)) throw new Error("Invalid ULID");
	if (u1 < u2) return -1;
	if (u1 > u2) return 1;
	return 0;
}

function formatUlid(ulid, { upper = true } = {}) {
	if (typeof ulid !== 'string') throw new Error('Input must be string')
	if (!isValidUlid(ulid)) throw new Error("Invalid ULID");
	return upper ? ulid.toUpperCase() : ulid.toLowerCase();
}

// ULID <-> UUID conversion
function ulidToBytes(ulid) {
	if (!isValidUlid(ulid)) throw new Error("Invalid ULID");
	let bytes = new Uint8Array(16);
	let val = 0n;
	for (let i = 0; i < 26; i++) {
		val = (val << 5n) | BigInt(crockfordBase32.indexOf(ulid.toUpperCase()[i]));
	}
	for (let i = 15; i >= 0; i--) {
		bytes[i] = Number(val & 0xffn);
		val = val >> 8n;
	}
	return bytes;
}

function bytesToUuid(bytes) {
	if (bytes.length !== 16) throw new Error("Invalid bytes length");
	const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidToBytes(uuid) {
	const hex = uuid.replace(/-/g, '');
	if (hex.length !== 32) throw new Error("Invalid UUID");
	let bytes = new Uint8Array(16);
	for (let i = 0; i < 16; i++) {
		bytes[i] = parseInt(hex.slice(i * 2, (i + 1) * 2), 16);
	}
	return bytes;
}

function bytesToUlid(bytes) {
	if (bytes.length !== 16) throw new Error("Invalid bytes length");
	let val = 0n;
	for (let i = 0; i < 16; i++) {
		val = (val << 8n) | BigInt(bytes[i]);
	}
	let ulid = '';
	for (let i = 0; i < 26; i++) {
		ulid = crockfordBase32[Number(val & 0x1fn)] + ulid;
		val = val >> 5n;
	}
	return ulid;
}

function ulidToUuid(ulid) {
	const bytes = ulidToBytes(ulid);
	return bytesToUuid(bytes);
}

function uuidToUlid(uuid) {
	const bytes = uuidToBytes(uuid);
	return bytesToUlid(bytes);
}

module.exports = {
	crockfordBase32,
	encodeTime,
	decodeUlid,
	generateRandomPart,
	generateUlid,
	generateMonotonicUlid,
	isValidUlid,
	compareUlids,
	formatUlid,
	ulidToUuid,
	uuidToUlid
};