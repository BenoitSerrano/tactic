import { textSplitter } from './textSplitter';

describe('textSplitter', () => {
    describe('split', () => {
        it('should split words by spaces', () => {
            const text = 'tu es la plus belle';

            const words = textSplitter.split(text);

            expect(words).toEqual(['tu', 'es', 'la', 'plus', 'belle']);
        });
        it('should handle multiple spaces', () => {
            const text = 'tu   es    la     belle';
            const words = textSplitter.split(text);
            expect(words).toEqual(['tu', 'es', 'la', 'belle']);
        });

        it('should handle punctuation', () => {
            const text = 'Bonjour, comment vas-tu?';
            const words = textSplitter.split(text);
            expect(words).toEqual(['Bonjour', ',', 'comment', 'vas', '-', 'tu', '?']);
        });

        it('should handle special characters', () => {
            const text = "l'été est là!";
            const words = textSplitter.split(text);
            expect(words).toEqual(['l', "'", 'été', 'est', 'là', '!']);
        });

        it('should handle empty string', () => {
            const text = '';
            const words = textSplitter.split(text);
            expect(words).toEqual([]);
        });

        it('should handle newlines', () => {
            const text = 'bonjour\nle monde';
            const words = textSplitter.split(text);
            expect(words).toEqual(['bonjour', 'le', 'monde']);
        });
    });
    describe('countBlanks', () => {
        it('should count the number of blanks in a text', () => {
            const text = 'tu es la plus belle';
            const count = textSplitter.countBlanks(text);
            expect(count).toEqual(0);
        });

        it('should count the number of blanks in a text with 1 blank', () => {
            const text = 'tu Ø plus belle';
            const count = textSplitter.countBlanks(text);
            expect(count).toEqual(1);
        });

        it('should count the number of blanks in a text with multiple blanks', () => {
            const text = 'tu Ø plus belle de Ø';
            const count = textSplitter.countBlanks(text);
            expect(count).toEqual(2);
        });
    });
});
