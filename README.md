# id-tools

A comprehensive library for generating and validating unique IDs in JavaScript/TypeScript. Supports various ID formats including UUID, ULID, MongoDB ObjectIds, and Nano IDs.

## Repository
[https://github.com/Der-Feb/id-tools](https://github.com/Der-Feb/id-tools)

## Installation

```bash
npm install id-tools
```

## Features

- Generate random numbers and strings
- Create custom-formatted IDs
- Generate UUIDs (v1, v3, v4, v5)
- Generate ULIDs (Universally Unique Lexicographically Sortable Identifier)
- Generate MongoDB ObjectIds
- Generate Nano IDs (URL-safe, compact)
- Convert between UUID ↔ ULID ↔ MongoDB ObjectId
- Validate various ID formats
- TypeScript support included

## Usage

### Random Numbers
```javascript
import { randomInteger, randomFloat, randomBoolean, randomWeightedBoolean } from 'id-tools';

// Generate a random integer between 1 and 100
const num = randomInteger(1, 100);

// Generate a random float between 0 and 1
const float = randomFloat(0, 1);

// Generate a random boolean (50/50 chance)
const bool = randomBoolean();

// Generate a random boolean with weight (e.g., 70% true)
const weightedBool = randomWeightedBoolean(0.7);
```

### Random Strings and IDs
```javascript
import { 
  randomLetter, 
  randomSpecialChar, 
  idByFormat,
  randomString,
  randomHex,
  randomBase32,
  randomBase64,
  randomRGB,
  randomHexColor,
  shuffleArray,
  shuffleString
} from 'id-tools';

// Generate a random letter (lowercase by default)
const letter = randomLetter();

// Generate a random special character
const special = randomSpecialChar();

// Generate a random string with options
const str = randomString(10, {
  upper: true,      // Include uppercase letters
  numbers: true,    // Include numbers
  specials: true    // Include special characters
});

// Generate an ID using a custom format
// Format: 'x' = letter, 'n' = digit, 's' = special, others = literal
const id = idByFormat('XXX-###-!!', {
  upper: true,      // Use uppercase letters
  numbers: true,    // Include numbers
  specials: true,   // Include special characters
  unique: true      // Ensure all characters are unique
});

// Generate random hex, base32, base64 strings
const hex = randomHex(8);
const base32 = randomBase32(16);
const base64 = randomBase64(12);

// Generate random colors
const rgb = randomRGB(); // e.g., 'rgb(123,45,67)'
const hexColor = randomHexColor(); // e.g., '#a1b2c3'

// Shuffle arrays and strings
const shuffledArray = shuffleArray([1, 2, 3, 4]);
const shuffledString = shuffleString('hello');
```

### Nano ID
```javascript
import { generateNanoid, isNanoid } from 'id-tools';

// Generate a default Nano ID (21 chars, URL-safe alphabet)
const nanoId = generateNanoid();

// Generate a custom Nano ID (15 chars, custom alphabet)
const customNanoId = generateNanoid(15, 'abcdefghijklmnopqrstuvwxyz');

// Validate Nano IDs
console.log(isNanoid(nanoId)); // true
console.log(isNanoid(customNanoId, 'abcdefghijklmnopqrstuvwxyz')); // true
```

### UUID Generation and Validation
```javascript
import { 
  generateUuid, 
  generateUuidV1,
  generateUuidV3,
  generateUuidV4,
  generateUuidV5,
  isValidUuid,
  NAMESPACES 
} from 'id-tools';

// Generate UUID v4 (random, default)
const uuidV4 = generateUuid();
const uuidV4Alt = generateUuidV4();

// Generate UUID v1 (time-based)
const uuidV1 = generateUuid(1);
const uuidV1Alt = generateUuidV1();

// Generate UUID v3 (name-based using MD5)
const uuidV3 = await generateUuidV3('hello world', NAMESPACES.DNS);

// Generate UUID v5 (name-based using SHA-1)
const uuidV5 = await generateUuidV5('hello world', NAMESPACES.URL);

// Validate UUIDs
console.log(isValidUuid(uuidV4)); // true
console.log(isValidUuid(uuidV1, { checkVersion: true, version: 1 })); // true
```

### ULID Generation and Validation
```javascript
import { 
  generateUlid, 
  decodeUlid, 
  isValidUlid,
  isUlid,
  ulidTime, 
  ulidTimestamp,
  ulidToUuid,
  uuidToUlid,
  compareUlids,
  formatUlid
} from 'id-tools';

// Generate a ULID
const ulid = generateUlid();

// Check if a string is a valid ULID
console.log(isValidUlid('01H9Z7K3Y5FJXG2N4V6D8T0W1')); // true
console.log(isUlid('01H9Z7K3Y5FJXG2N4V6D8T0W1')); // alias for isValidUlid

// Decode a ULID to get timestamp and random parts
const decoded = decodeUlid(ulid);
console.log(decoded.timestamp); // timestamp in ms
console.log(decoded.random); // random part

// Get just the timestamp
console.log(ulidTime(ulid));
console.log(ulidTimestamp(ulid)); // alias

// Convert between ULID and UUID
const uuidFromUlid = ulidToUuid(ulid);
const ulidFromUuid = uuidToUlid(uuidFromUlid);

// Compare ULIDs lexicographically
console.log(compareUlids(ulid1, ulid2)); // -1, 0, or 1
```

### MongoDB ObjectId
```javascript
import { 
  generateMongoId, 
  generateMongoID,
  isMongoId,
  isMongoID,
  mongoIdTimestamp,
  mongoIdToUuid,
  uuidToMongoId
} from 'id-tools';

// Generate a new MongoDB ObjectId
const objectId = generateMongoId();
const objectIdAlt = generateMongoID(); // alias

// Check if a string is a valid MongoDB ObjectId
console.log(isMongoId('507f1f77bcf86cd799439011')); // true
console.log(isMongoId('507f1f77bcf86cd799439011', {
  upper: false,             // Allow uppercase hex letters
  checkTimestamp: true,     // Validate timestamp range
  maxTimestamp: Math.floor(Date.now() / 1000) + 86400,
  minTimestamp: 0,
  strictLength: true,       // Require exactly 24 characters
  checkRandomPart: true     // Ensure random part is not all zeros
})); // true

// Get the timestamp from a MongoDB ObjectId (ms)
const timestamp = mongoIdTimestamp('507f1f77bcf86cd799439011');

// Convert between MongoDB ObjectId and UUID
const uuidFromMongoId = mongoIdToUuid(objectId);
const mongoIdFromUuid = uuidToMongoId(uuidFromMongoId);
```

### Prefix ID
```javascript
import { generatePrefixId } from 'id-tools';

// Generate an ID with prefix and random suffix
const prefixedId = generatePrefixId(
  'user',      // prefix
  16,          // length of random part (default 20)
  '_',         // delimiter (default '-')
  { 
    upper: false, 
    numbers: true, 
    specials: false 
  }
);
console.log(prefixedId); // e.g., 'user_abc123def456'
```

## API Reference

### Random Generation
- `randomInteger(min?: number, max: number): number`
- `randomLetter(upper?: boolean): string`
- `randomSpecialChar(): string`
- `randomBoolean(): boolean`
- `randomWeightedBoolean(weight?: number): boolean`
- `randomString(length: number, options?: RandomStringOptions): string`
- `randomHex(length: number): string`
- `randomBase32(length: number): string`
- `randomBase64(length: number): string`
- `randomFloat(min: number, max: number): number`
- `randomDate(start: Date, end: Date): Date`
- `randomRGB(): string`
- `randomHexColor(): string`
- `randomDigit(): number`
- `shuffleArray<T>(array: T[]): T[]`
- `shuffleString(str: string): string`
- `generateNanoid(size?: number, alphabet?: string): string`
- `isNanoid(id: string, alphabet?: string): boolean`

### ID Generation
- `idByFormat(format: string, options?: IdByFormatOptions): string`
- `generatePrefixId(prefix: string, length?: number, delimiter?: string, options?: object): string`

### UUID Functions
- `generateUuid(version?: number, options?: object): string | Promise<string>`
- `generateUuidV1(): string`
- `generateUuidV3(name: string | Uint8Array, namespace: string): Promise<string>`
- `generateUuidV4(): string`
- `generateUuidV5(name: string | Uint8Array, namespace: string): Promise<string>`
- `isValidUuid(id: string, options?: IsUuidOptions): boolean`
- `NAMESPACES`: { DNS: string, URL: string, OID: string, X500: string }

### ULID Functions
- `generateUlid(time?: number): string`
- `decodeUlid(ulid: string): { timestamp: number, random: string }`
- `isValidUlid(ulid: string): boolean`
- `isUlid(ulid: string): boolean` (alias for isValidUlid)
- `ulidTime(ulid: string): number`
- `ulidTimestamp(ulid: string): number` (alias for ulidTime)
- `ulidToUuid(ulid: string): string`
- `uuidToUlid(uuid: string): string`
- `compareUlids(u1: string, u2: string): number`
- `formatUlid(ulid: string, options?: FormatUlidOptions): string`

### MongoDB ObjectId Functions
- `generateMongoId(): string`
- `generateMongoID(): string` (alias)
- `isMongoId(id: string, options?: IsMongoIDOptions): boolean`
- `isMongoID(id: string, options?: IsMongoIDOptions): boolean` (alias)
- `mongoIdTimestamp(id: string): number`
- `mongoIdToUuid(id: string): string`
- `uuidToMongoId(uuid: string): string`

## License
MIT
