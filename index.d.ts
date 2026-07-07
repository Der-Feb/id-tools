// ---------------------------------------------random----------------------------------------------
/**
 * Generate a random integer between min and max (inclusive)
 * @param min Minimum value (default = 0)
 * @param max Maximum value
 * @returns Random integer between min and max
 */
export declare const randomInteger: (min: number, max: number) => number;

/**
 * Format object containing character sets for different types of characters
 */
export declare const format: {
	n: string;
	s: string;
	a: string;
	A: string;
	b32: string;
	b64: string;
};

/**
 * Generate an ID based on a format string
 * @param format - Format string ('x' = letter, 'n' = digit, 's' = special, others = literal)
 * @param options - Options for ID generation
 * @returns Generated ID
 */
export declare const idByFormat: (format: string, options?: IdByFormatOptions) => string;

/**
 * Generate a random letter
 * @param upper Whether the letter should be uppercase (default = false)
 * @returns Random letter (a-z or A-Z)
 */
export declare const randomLetter: (upper?: boolean) => string;

/**
 * Generate a random special character
 * @returns Random character from "!@#$%^&*()_+[]{}|;':"
 */
export declare const randomSpecialChar: () => string;

/**
 * Generate a random boolean
 * @returns true or false
 */
export declare const randomBoolean: () => boolean;

/**
 * Generate a random boolean with a given weight
 * @param weight The weight of the boolean (default = 0.5)
 * @returns true or false
 */
export declare const randomWeightedBoolean: (weight?: number) => boolean;

/**
 * Generate a random string with letters, numbers, and optionally special characters
 * @param length Length of the string to generate
 * @param options Options to customize string generation
 * @returns Randomly generated string
 */
export declare const randomString: (length: number, options?: RandomStringOptions) => string;

/**
 * Generate a random hexadecimal string
 * @param length Number of hex digits
 * @returns Random hex string
 */
export declare const randomHex: (length: number) => string;

/**
 * Generate a random Base32 string
 * @param length Number of characters
 * @returns Random Base32 string
 */
export declare const randomBase32: (length: number) => string;

/**
 * Generate a random Base64 string
 * @param length Number of characters
 * @returns Random Base64 string
 */
export declare const randomBase64: (length: number) => string;

/**
 * Generate a random float between min and max
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random float
 */
export declare const randomFloat: (min: number, max: number) => number;

/**
 * Shuffle the elements of an array in place using Fisher–Yates algorithm
 * @param array The array to shuffle
 * @returns The same array with elements shuffled
 * @example
 * shuffleArray([1, 2, 3, 4]) // e.g., [3, 1, 4, 2]
 */
export declare const shuffleArray: <T>(array: T[]) => T[];

/**
 * Generate a random date between start and end
 * @param start Start date
 * @param end End date
 * @returns Random date
 */
export declare const randomDate: (start: Date, end: Date) => Date;

/**
 * Generate a random RGB color
 * @returns Random RGB color
 */
export declare const randomRGB: () => string;

/**
 * Generate a random hex color
 * @returns Random hex color
 */
export declare const randomHexColor: () => string;

/**
 * Generate a random digit (0-9)
 * @returns Random digit
 */
export declare const randomDigit: () => number;

/**
 * Generate a Nano ID
 * @param size - Length of the ID (default: 21)
 * @param alphabet - Custom alphabet to use
 * @returns Generated Nano ID
 */
export declare const generateNanoid: (size?: number, alphabet?: string) => string;

/**
 * Check if a string is a valid Nano ID
 * @param id - ID to validate
 * @param alphabet - Alphabet the ID should be using
 * @returns True if valid, false otherwise
 */
export declare const isNanoid: (id: string, alphabet?: string) => boolean;


// ---------------------------------------------uuid----------------------------------------------
/**
 * UUID v4 format:
 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * x -> random hex digit
 * 4 -> fixed digit indicating version 4
 * y -> random hex digit from the set {8, 9, A, B} (variant)
 * Example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 */

/**
 * Generates a UUID string.
 * @returns A UUID string.
 */
export declare const generateUuid: (version?: number) => string;


interface IsUuidOptions {
	upper?: boolean;
	version?: number;
	strictLength?: boolean;
	timestamp?: boolean;
	minTimestamp?: number;
	maxTimestamp?: number;
	checkVersion?: boolean;
}

/**
 * Verify if string is UUID form
 * @params id - The string id to verify
 * @returns boolean
 */
export declare const isValidUuid: (id: string, options?: IsUuidOptions) => boolean;


// ---------------------------------------------ulid----------------------------------------------
/** 
 * Crockford's Base32 characters used in ULIDs
 */
export declare const crockfordBase32: string;

/**
 * Encodes a timestamp into a ULID-compatible string.
 * @param time - The timestamp to encode. Defaults to the current time.
 * @returns The encoded timestamp as a string.
 */
export declare const encodeTime: (time?: number) => string;

/**
 * Generates a random part for a ULID.
 * @param length - The length of the random part. Defaults to 16.
 * @returns A random string of the specified length.
 */
export declare const generateRandomPart: (length?: number) => string;

/**
 * Generates a ULID string.
 * @param time - The timestamp to encode. Defaults to the current time.
 * @returns A full ULID string.
 */
export declare const generateUlid: (time?: number) => string;

/**
 * Decodes a ULID string into its timestamp and random part.
 * @param ulid - The ULID string to decode.
 * @returns An object containing the timestamp and random part.
 */
export declare const decodeUlid: (ulid: string) => {
	timestamp: number;
	random: string;
};

/**
 * Checks if a string is a valid ULID.
 * @param ulid - The ULID string to validate.
 * @returns True if the string is a valid ULID, false otherwise.
 */
export declare const isValidUlid: (ulid: string) => boolean;

/**
 * Alias for isValidUlid
 */
export declare const isUlid: (ulid: string) => boolean;

/**
 * Generates a monotonically increasing ULID that maintains sort order.
 * This is particularly useful for database keys where you need to maintain insertion order
 * even when ULIDs are generated in the same millisecond.
 * 
 * When multiple ULIDs are generated in the same millisecond, it increments the random part
 * of the ULID to ensure sort order is maintained. This guarantees that ULIDs generated
 * in the same millisecond are still sortable in the order they were created.
 * 
 * @example
 * // Generated in the same millisecond:
 * generateMonotonicUlid() // Returns '01H9Z2K3M4N5P6Q7R8S9T0V1W2'
 * generateMonotonicUlid() // Returns '01H9Z2K3M4N5P6Q7R8S9T0V1W3'
 * 
 * @returns A new ULID string that is guaranteed to be greater than the previous one
 */
export declare const generateMonotonicUlid: () => string;

/**
 * Compares two ULID strings lexicographically.
 * This is useful for sorting ULIDs while maintaining their time-based order.
 * 
 * @param u1 - First ULID string to compare
 * @param u2 - Second ULID string to compare
 * @returns 
 *   - A negative number if u1 is less than u2
 *   - Zero if u1 is equal to u2
 *   - A positive number if u1 is greater than u2
 * @throws {Error} If either input is not a valid ULID
 * 
 * @example
 * // Returns a negative number (u1 < u2)
 * compareUlids('01H9Z2K3M4N5P6Q7R8S9T0V1W2', '01H9Z2K3M4N5P6Q7R8S9T0V1W3')
 */
export declare const compareUlids: (u1: string, u2: string) => number;

/**
 * Formats a ULID string to either uppercase or lowercase.
 * @param ulid - The ULID string to format
 * @param options - Formatting options
 * @returns The formatted ULID string
 * @throws {Error} If input is not a string or is an invalid ULID
 */
export declare const formatUlid: (ulid: string, options?: FormatUlidOptions) => string;

/**
 * Convert a ULID to a UUID
 * @param ulid - The ULID string to convert
 * @returns UUID string
 */
export declare const ulidToUuid: (ulid: string) => string;

/**
 * Convert a UUID to a ULID
 * @param uuid - The UUID string to convert
 * @returns ULID string
 */
export declare const uuidToUlid: (uuid: string) => string;

/**
 * Get the timestamp from a ULID
 * @param ulid - The ULID string
 * @returns Timestamp in milliseconds
 */
export declare const ulidTime: (ulid: string) => number;

/**
 * Alias for ulidTime
 */
export declare const ulidTimestamp: (ulid: string) => number;


// ---------------------------------------------mongoid----------------------------------------------
/**
 * Generate a MongoDB-style ObjectID
 * @returns {string} 24-character hex string, 
 * format is: 507f1f77 bcf86cd799 439011 => TTTTTTTT RRRRRRRRRR CCCCCC
 * | Part               | Bytes | Hex Length | Purpose                             |
 * | ------------------ | ----- | ---------- | ----------------------------------- |
 * | Timestamp(t)       | 4     | 8          | Creation time (seconds since epoch) |
 * | Random/Machine (r) | 5     | 10         | Unique machine/process identifier   |
 * | Counter(c)         | 3     | 6          | Increment to avoid collisions       |
 * | **Total**          | 12    | 24         | Full MongoDB ObjectID               | 
*/
export declare const generateMongoID: () => string;

/**
 * Alias for generateMongoID
 */
export declare const generateMongoId: () => string;

/**
 * Check if a string is a valid MongoDB ObjectID
 * @param id - The string to validate
 * @param options - Validation options
 * @returns True if valid ObjectID, false otherwise
*/
export declare const isMongoID: (id: string, options?: IsMongoIDOptions) => boolean;

/**
 * Alias for isMongoID
 */
export declare const isMongoId: (id: string, options?: IsMongoIDOptions) => boolean;

/**
 * Get the timestamp from a MongoDB ObjectId in milliseconds
 * @param id - MongoDB ObjectId string
 * @returns Timestamp in milliseconds
 */
export declare const mongoIdTimestamp: (id: string) => number;

/**
 * Convert a MongoDB ObjectId to a UUID
 * @param id - MongoDB ObjectId string
 * @returns UUID string
 */
export declare const mongoIdToUuid: (id: string) => string;

/**
 * Convert a UUID to a MongoDB ObjectId
 * @param uuid - UUID string
 * @returns MongoDB ObjectId string
 */
export declare const uuidToMongoId: (uuid: string) => string;


// ---------------------------------------------prefixIds----------------------------------------------
/**
 * Generating a random prefix ID
 * @param prefix - The string which will be in front of id
 * @param length - Length of random part, @default 20
 * @param delimiter - A sign between prefix and random suffix
 * @param options - upper for uppercase only, numbers for if the random suffix will contain
 *   numbers, specials for special characters.
 */
export declare const generatePrefixId: (
	prefix: string,
	length?: number,
	delimiter?: string,
	options?: { upper?: boolean; numbers?: boolean; specials?: boolean }
) => string;


// ---------------------------------------------types----------------------------------------------
export type IdByFormatOptions = {
	/** Use uppercase letters */
	upper?: boolean;
	/** Include numbers */
	numbers?: boolean;
	/** Include special characters */
	specials?: boolean;
	/** Ensure all characters in ID are unique */
	unique?: boolean;
};

export type RandomStringOptions = {
	/** Whether letters should be uppercase */
	upper?: boolean;
	/** Include numbers in the string */
	numbers?: boolean;
	/** Include special characters in the string */
	specials?: boolean;
};

export type FormatUlidOptions = {
	/** Whether to format as uppercase (default: true) */
	upper?: boolean;
};

export type IsMongoIDOptions = {
	/** Allow uppercase hex letters in the ID */
	upper?: boolean;
	/** Validate that the timestamp (first 8 chars) is within a plausible range */
	checkTimestamp?: boolean;
	/** Maximum allowed timestamp in seconds since epoch (default: now + 1 day) */
	maxTimestamp?: number;
	/** Minimum allowed timestamp in seconds since epoch (default: 0 / Jan 1, 1970) */
	minTimestamp?: number;
	/** Strict mode: only accept 24-character IDs (otherwise allow 12-byte buffers) */
	strictLength?: boolean;
	/** Check that counter/random part is not all zeros (optional) */
	checkRandomPart?: boolean;
};
