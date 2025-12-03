# id-tools

A comprehensive library for generating and validating unique IDs in JavaScript/TypeScript. Supports various ID formats including UUID, ULID, and MongoDB ObjectIds.

## Installation

```bash
npm install id-tools
```

## Features

- Generate random numbers and strings
- Create custom-formatted IDs
- Generate ULIDs (Universally Unique Lexicographically Sortable Identifier)
- Generate MongoDB ObjectIds
- Validate various ID formats
- TypeScript support included

## Usage

### Random Numbers

```typescript
import { randomNumber } from 'id-tools';

// Generate a random number between 1 and 100
const num = randomNumber(1, 100);
```

### Random Strings and IDs

```typescript
import { 
  randomLetter, 
  randomSpecialChar, 
  idByFormat,
  randomString,
  randomStringFromSet,
  randomStringFromSetAsync,
  randomStringFromSetSync
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
```

### ULID Generation and Validation

```typescript
import { 
  generateUlid, 
  decodeUlid, 
  isUlid, 
  ulidTime, 
  ulidTimestamp,
  ulidToUuid,
  uuidToUlid
} from 'id-tools';

// Generate a ULID
const ulid = generateUlid();

// Check if a string is a valid ULID
const isValid = isUlid('01H9Z7K3Y5FJXG2N4V6D8T0W1');

// Decode a ULID to get timestamp and random parts
const decoded = decodeUlid('01H9Z7K3Y5FJXG2N4V6D8T0W1');
// Returns: { timestamp: 1681234567890, random: '5FJXG2N4V6D8T0W1' }

// Convert between ULID and UUID
const uuid = ulidToUuid(ulid);
const newUlid = uuidToUlid(uuid);
```

### MongoDB ObjectId

```typescript
import { 
  generateMongoId, 
  isMongoId,
  mongoIdTimestamp,
  mongoIdToUuid,
  uuidToMongoId
} from 'id-tools';

// Generate a new MongoDB ObjectId
const objectId = generateMongoId();

// Check if a string is a valid MongoDB ObjectId
const isValid = isMongoId('507f1f77bcf86cd799439011', {
  upper: false,             // Allow uppercase hex letters
  checkTimestamp: true,     // Validate timestamp range
  strictLength: true,       // Require exactly 24 characters
  checkRandomPart: true     // Ensure random part is not all zeros
});

// Get the timestamp from a MongoDB ObjectId
const timestamp = mongoIdTimestamp('507f1f77bcf86cd799439011');

// Convert between MongoDB ObjectId and UUID
const uuid = mongoIdToUuid(objectId);
const newObjectId = uuidToMongoId(uuid);
```

## API Reference

### Random Generation

- `randomNumber(min: number, max: number): number`
  - Generate a random integer between min and max (inclusive)

- `randomLetter(upper: boolean = false): string`
  - Generate a random letter (a-z or A-Z)

- `randomSpecialChar(): string`
  - Generate a random special character from "!@#$%^&*()_+[]{}|;:',.<>?/"

- `randomString(length: number, options?: RandomStringOptions): string`
  - Generate a random string with specified options
  - Options:
    - `upper?`: boolean - Include uppercase letters (default: false)
    - `numbers?`: boolean - Include numbers (default: false)
    - `specials?`: boolean - Include special characters (default: false)

### ID Generation

- `idByFormat(format: string, options?: IdByFormatOptions): string`
  - Generate an ID based on a format string
  - Format: 'x' = letter, 'n' = digit, 's' = special, others = literal
  - Options:
    - `upper?`: boolean - Use uppercase letters (default: false)
    - `numbers?`: boolean - Include numbers (default: true)
    - `specials?`: boolean - Include special characters (default: false)
    - `unique?`: boolean - Ensure all characters are unique (default: false)

### ULID Functions

- `generateUlid(time?: number): string`
  - Generate a ULID (time defaults to current time if not provided)

- `decodeUlid(ulid: string): { timestamp: number, random: string }`
  - Decode a ULID into its timestamp and random parts

- `isUlid(value: string): boolean`
  - Check if a string is a valid ULID

- `ulidTime(ulid: string): number`
  - Get the timestamp from a ULID

- `ulidTimestamp(ulid: string): number`
  - Alias for ulidTime

- `ulidToUuid(ulid: string): string`
  - Convert a ULID to a UUID

- `uuidToUlid(uuid: string): string`
  - Convert a UUID to a ULID

### MongoDB ObjectId Functions

- `generateMongoId(time?: number): string`
  - Generate a new MongoDB ObjectId

- `isMongoId(id: string, options?: IsMongoIDOptions): boolean`
  - Check if a string is a valid MongoDB ObjectId
  - Options:
    - `upper?`: boolean - Allow uppercase hex letters (default: false)
    - `checkTimestamp?`: boolean - Validate timestamp range (default: false)
    - `maxTimestamp?`: number - Maximum allowed timestamp in seconds (default: now + 1 day)
    - `minTimestamp?`: number - Minimum allowed timestamp in seconds (default: 0)
    - `strictLength?`: boolean - Require exactly 24 characters (default: true)
    - `checkRandomPart?`: boolean - Ensure random part is not all zeros (default: false)

- `mongoIdTimestamp(id: string): number`
  - Get the timestamp from a MongoDB ObjectId in milliseconds

- `mongoIdToUuid(id: string): string`
  - Convert a MongoDB ObjectId to a UUID

- `uuidToMongoId(uuid: string): string`
  - Convert a UUID to a MongoDB ObjectId

## License

MIT