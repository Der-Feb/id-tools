const format = {
	n: '1234567890',
	s: '!@#$%^&*()_+[]{}|;:',
	a: 'abcdefghijklmnopqrstuvwxyz',
	A: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	b32: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
	b64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
	nanoid: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
}

const NANOID_DEFAULT_SIZE = 21;

function swap(a, b) {
	let temp = a;
	a = b;
	b = temp;
}

function idByFormat(format, options = { upper: false, numbers: true, specials: false, unique: false }) {
    let result = '';
    let usedChars = new Set();

    for (let i = 0; i < format.length; i++) {
        let char = '';
        let attempts = 0;

        do {
            if (format[i] === 'x') {
                char = randomLetter(options.upper);
            } else if (format[i] === 'n') {
                char = randomDigit().toString();
            } else if (format[i] === 's') {
                char = randomSpecialChar();
            } else {
                char = format[i];
            }

            attempts++;
            if (attempts > 100) break;

        } while (options.unique && usedChars.has(char));

        result += char;
        if (options.unique) usedChars.add(char);
    }

    return result;
}

function randomInteger(min = 0, max) {
	if(max < min) swap(min, max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomLetter(upper = false) {
	const charCode = randomInteger(0, 25) + (upper ? 65 : 97);
	return String.fromCharCode(charCode);
}

function randomSpecialChar() {
	return format.s[randomInteger(0, format.s.length - 1)];
}

function randomBoolean() {
	return Math.random() < 0.5;
}

function randomWeightedBoolean(weight = 0.5) {
	return Math.random() < weight;
}

function randomString(
	length, 
	options = { upper: false, numbers: true, specials: false }
) {
	let result = '';
	const { upper, numbers, specials } = options;

	for (let i = 0; i < length; i++) {
		const rand = Math.random();
		if (rand < 0.5) {
			result += randomLetter(upper);
		} else if (numbers && rand < 0.75) {
			result += randomDigit();
		} else if (specials) {
			result += randomSpecialChar();
		} else {
			result += randomLetter(upper); 
		}
	}
	return result;
}

function randomHex(length) {
	if (length <= 0) return "";
	const hexChars = format.n + format.a;
	let result = "";
	for (let i = 0; i < length; i++) {
		result += hexChars[Math.floor(Math.random() * hexChars.length)];
	}
	return result;
};

function randomBase32(length) {
	if (length <= 0) return "";
	const base32Chars = format.b32;
	let result = "";
	for (let i = 0; i < length; i++) {
		result += base32Chars[Math.floor(Math.random() * base32Chars.length)];
	}
	return result;
};

function randomBase64(length) {
	if (length <= 0) return "";
	const base64Chars = format.b64;
	let result = "";
	for (let i = 0; i < length; i++) {
		result += base64Chars[Math.floor(Math.random() * base64Chars.length)];
	}
	return result;
};

function randomFloat(min, max) {
	return Math.random() * (max - min) + min;
};

function randomDate(start, end) {
	const startDate = new Date(start);
	const endDate = new Date(end);
	return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

function randomRGB() {
	return `rgb(${randomInteger(0,255)},${randomInteger(0,255)},${randomInteger(0,255)})`;
}

function randomHexColor() {
	return `#${randomHex(6)}`;
}


// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

function shuffleString(word) {
	return shuffleArray(word.split("")).join("");
}

function randomDigit() {
	return Math.floor(Math.random() * 10);
}

function generateNanoid(size = NANOID_DEFAULT_SIZE, alphabet = format.nanoid) {
    let id = '';
    const bytes = cryptoRandomBytes(size);
    
    for (let i = 0; i < size; i++) {
        id += alphabet[bytes[i] % alphabet.length];
    }
    
    return id;
}

function isNanoid(id, alphabet = format.nanoid) {
    if (typeof id !== 'string') return false;
    const regex = new RegExp(`^[${escapeRegExp(alphabet)}]+$`);
    return regex.test(id);
}

function cryptoRandomBytes(size) {
    // Check for Node.js crypto
    try {
        const crypto = require('crypto');
        return crypto.randomBytes(size);
    } catch (e) {
        // Check for browser crypto
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const bytes = new Uint8Array(size);
            crypto.getRandomValues(bytes);
            return bytes;
        }
        // Fallback to Math.random
        const bytes = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
        return bytes;
    }
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
	format,
	idByFormat,
	randomInteger,
	randomLetter,
	randomSpecialChar,
	randomBoolean,
	randomWeightedBoolean,
	randomString,
	randomHex,
	randomBase32,
	randomBase64,
	randomFloat,
	randomDate,
	randomRGB,
	randomDigit,
	randomHexColor,
	shuffleArray,
	shuffleString,
	generateNanoid,
	isNanoid
}