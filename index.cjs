
const random = require('./src/random.cjs');
const ulid = require('./src/ulid.cjs');
const uuid = require('./src/uuid.cjs');
const mongoid = require('./src/mongoid.cjs');
const prefixId = require('./src/prefixId.cjs');
const shuffle = require('./src/shuffle.cjs')

module.exports = {
	...random,
	...ulid,
	...uuid,
	...mongoid,
	...prefixId,
	...shuffle,

	// Aliases for backward compatibility and consistency
	generateMongoId: mongoid.generateMongoID,
	isMongoId: mongoid.isMongoID,
	isUlid: ulid.isValidUlid,
	ulidTime: (ulidStr) => ulid.decodeUlid(ulidStr).timestamp,
	ulidTimestamp: (ulidStr) => ulid.decodeUlid(ulidStr).timestamp,
};