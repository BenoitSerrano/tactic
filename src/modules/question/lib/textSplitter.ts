import { NON_WORD_CHARACTERS, TAT_BLANK_STRING } from '../constants';

const textSplitter = { split, countBlanks };

const SEPARATORS = [' ', '\n', '\t'];

function split(text: string): string[] {
    let words: string[] = [];
    let currentWord = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (SEPARATORS.includes(char)) {
            if (currentWord !== '') {
                words.push(currentWord);
                currentWord = '';
            }
        } else if (NON_WORD_CHARACTERS.includes(char)) {
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
