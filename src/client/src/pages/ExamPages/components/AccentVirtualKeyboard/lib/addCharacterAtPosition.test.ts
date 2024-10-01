import { addCharacterAtPosition } from './addCharacterAtPosition';

describe('addCharacterAtPosition', () => {
    it('should add the character if in the middle of the text', () => {
        const position = 1;
        const characterToAdd = 'B';
        const text = 'AC';

        const newText = addCharacterAtPosition(characterToAdd, position, text);

        expect(newText).toBe('ABC');
    });

    it('should add the character at the end of the text', () => {
        const position = 2;
        const characterToAdd = 'C';
        const text = 'AB';

        const newText = addCharacterAtPosition(characterToAdd, position, text);

        expect(newText).toBe('ABC');
    });

    it('should add the character at the beginning of the text', () => {
        const position = 0;
        const characterToAdd = 'A';
        const text = 'BC';

        const newText = addCharacterAtPosition(characterToAdd, position, text);

        expect(newText).toBe('ABC');
    });

    it('should add the character if no text', () => {
        const position = 0;
        const characterToAdd = 'A';
        const text = '';

        const newText = addCharacterAtPosition(characterToAdd, position, text);

        expect(newText).toBe('A');
    });
});
