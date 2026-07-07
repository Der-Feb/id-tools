const test = require("../index.cjs");

var idByFormatTest = test.idByFormat('xxx-nnn-xxx-nnn-sss');
console.log("Random id by format", idByFormatTest);

var randomIntegerTest = test.randomInteger(7, 2);
console.log("Random Number", randomIntegerTest);

var randomLetterTest = test.randomLetter();
console.log("Random Letter", randomLetterTest);

var randomStringTest = test.randomString(5, { upper: false, numbers: false, specials: false });
console.log("Random string", randomStringTest);

var randomBase64Test = test.randomBase64(5);
console.log("Random base 64", randomBase64Test);

// Test new functions
var ulid = test.generateUlid();
console.log("Generated ULID", ulid);
console.log("Is valid ULID?", test.isValidUlid(ulid));
console.log("Is valid ULID (alias)?", test.isUlid(ulid));
console.log("ULID timestamp", test.ulidTime(ulid));

var uuid = test.generateUuid();
console.log("Generated UUID", uuid);
console.log("Is valid UUID?", test.isValidUuid(uuid));

var mongoId = test.generateMongoID();
console.log("Generated MongoDB ObjectId", mongoId);
console.log("Is valid MongoDB ObjectId?", test.isMongoID(mongoId));
console.log("Is valid MongoDB ObjectId (alias)?", test.isMongoId(mongoId));
console.log("MongoDB ObjectId timestamp", test.mongoIdTimestamp(mongoId));

var prefixId = test.generatePrefixId('test', 10, '-', { upper: true, numbers: true, specials: false });
console.log("Generated Prefix ID", prefixId);

var nanoId = test.generateNanoid();
console.log("Generated Nano ID", nanoId);
console.log("Is valid Nano ID?", test.isNanoid(nanoId));

var customNanoId = test.generateNanoid(15, 'abcdefghijklmnopqrstuvwxyz');
console.log("Generated custom Nano ID", customNanoId);
console.log("Is valid custom Nano ID?", test.isNanoid(customNanoId, 'abcdefghijklmnopqrstuvwxyz'));

// Test UUID versions
var uuidV1 = test.generateUuidV1();
console.log("Generated UUID v1", uuidV1);
console.log("Is valid UUID v1?", test.isValidUuid(uuidV1, { checkVersion: true, version: 1 }));

var uuidV4 = test.generateUuidV4();
console.log("Generated UUID v4", uuidV4);
console.log("Is valid UUID v4?", test.isValidUuid(uuidV4, { checkVersion: true, version: 4 }));

// Test UUID v3 and v5 (async)
(async function() {
    const uuidV3 = await test.generateUuidV3('hello world', test.NAMESPACES.DNS);
    console.log("Generated UUID v3", uuidV3);
    console.log("Is valid UUID v3?", test.isValidUuid(uuidV3, { checkVersion: true, version: 3 }));

    const uuidV5 = await test.generateUuidV5('hello world', test.NAMESPACES.DNS);
    console.log("Generated UUID v5", uuidV5);
    console.log("Is valid UUID v5?", test.isValidUuid(uuidV5, { checkVersion: true, version: 5 }));
})();

