import { APOSTROPHES, NON_WORD_CHARACTERS, TAT_BLANK_STRING } from '../constants';

const textSplitter = { split, countBlanks };

const SEPARATORS = [' ', '\n', '\t'];

function split(text: string, option?: { shouldApostrophesBeBinding?: boolean }): string[] {
    let words: string[] = [];
    let currentWord = '';
    const SPLITTING_CHARACTERS = option?.shouldApostrophesBeBinding
        ? NON_WORD_CHARACTERS
        : [...NON_WORD_CHARACTERS, ...APOSTROPHES];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (SEPARATORS.includes(char)) {
            if (currentWord !== '') {
                words.push(currentWord);
                currentWord = '';
            }
        } else if (SPLITTING_CHARACTERS.includes(char)) {
            if (currentWord !== '') {
                words.push(currentWord);
                currentWord = '';
            }
            words.push(char);
        } else {
            currentWord += char;
        }
    }
    if (currentWord !== '') {
        words.push(currentWord);
    }
    return words;
}

function countBlanks(text: string): number {
    const REGEX = new RegExp(TAT_BLANK_STRING, 'g');
    return text.match(REGEX)?.length ?? 0;
}

export { textSplitter };
