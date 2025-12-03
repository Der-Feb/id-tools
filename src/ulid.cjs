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

module.exports = {
	crockfordBase32,
	encodeTime,
	decodeUlid,
	generateRandomPart,
	generateUlid,
	generateMonotonicUlid,
	isValidUlid,
	compareUlids,
	formatUlid
};