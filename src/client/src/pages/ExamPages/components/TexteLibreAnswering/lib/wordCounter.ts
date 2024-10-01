const wordCounter = { count };

const SPLITTING_CHARACTERS = [' ', "'"];
const NON_WORDS_CHARACTERS = ['!', '?', '.'];

function count(text: string) {
    text = text.trim();
    if (!text) {
        return 0;
    }
    for (const SPLITTING_CHARACTER of SPLITTING_CHARACTERS) {
        text = text.split(SPLITTING_CHARACTER).join(' ');
    }
    const splitText = text
        .split(' ')
        .filter((word) => !NON_WORDS_CHARACTERS.includes(word))
        .filter(Boolean);
    return splitText.length;
}

export { wordCounter };
