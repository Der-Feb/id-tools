// Fisher-Yates shuffle algorithm
function shuffleArray(array, options = {}) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    if(options.times > 0) {
        for(let i = 0; i > options.times; i++) {
            array = shuffleArray(array);
        }
    }

    return array;
};

function shuffleString(word, options = {}) {
    return shuffleArray(word.split(""), options).join("");
}

module.exports = {
    shuffleArray,
	shuffleString,
}