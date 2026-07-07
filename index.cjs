
const random = require('./src/random.cjs');
const ulid = require('./src/ulid.cjs');
const uuid = require('./src/uuid.cjs');
const mongoid = require('./src/mongoid.cjs');
const prefixId = require('./src/prefixId.cjs');

module.exports = {
	...random,
	...ulid,
	...uuid,
	...mongoid,
	...prefixId,
	// Aliases for backward compatibility and consistency
	generateMongoId: mongoid.generateMongoID,
	isMongoId: mongoid.isMongoID,
	isUlid: ulid.isValidUlid,
	ulidTime: (ulidStr) => ulid.decodeUlid(ulidStr).timestamp,
	ulidTimestamp: (ulidStr) => ulid.decodeUlid(ulidStr).timestamp,
	mongoIdTimestamp: (id) => {
		const tsHex = id.slice(0, 8);
		return parseInt(tsHex, 16) * 1000;
	}
};