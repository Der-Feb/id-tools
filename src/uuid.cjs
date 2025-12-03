
function generateUuid(version = 4) {
	if (version < 1 || version > 5) 
		throw new Error("Version must be 1-5");

	return "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c, i) {
		const random = Math.random() * 16 | 0;

		if (i === 14) {
			return version.toString(16);
		} 

		if (c === 'x') {
			return random.toString(16);
		} else if (c === 'y') {
			return ((random & 0x3) | 0x8).toString(16);
		}
	});
}

function isValidUuid(id, options = { upper: false, checkVersion: false, version: 4, strictLength: false, timestamp: false, minTimestamp: 0, maxTimestamp: Math.floor(Date.now() / 1000) + 86400 }) {
	const { upper, checkVersion, version, strictLength, timestamp, minTimestamp, maxTimestamp } = options;
	if (typeof id !== 'string') return false;
	if (strictLength && id.length !== 36) return false;
	if (upper && id.toLowerCase() !== id) return false;
	if (timestamp) {
		const timestampPart = id.slice(0, 8);
		const ts = parseInt(timestampPart, 16);
		if (isNaN(ts)) return false;
		if (ts < minTimestamp || ts > maxTimestamp) return false;
	}
	if (checkVersion) {
		const versionPart = id.slice(14, 15);
		const v = parseInt(versionPart, 16);
		if (isNaN(v)) return false;
		if (v !== version) return false;
	}
	return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

module.exports = {
	generateUuid,
	isValidUuid
}