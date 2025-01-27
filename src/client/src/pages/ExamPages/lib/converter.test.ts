import { acceptableAnswerType } from '../../../types';
import { converter } from './converter';

describe('converter', () => {
    const title = 'tu es Ø la Ø belle de toutes Ø femmes';
    describe('convertTextInputToAnswer', () => {
        it('should convert when there was no character before, first word', () => {
            const currentAnswer = '';
            const wordIndex = 2;
            const textInput = 'e';

            const newCurrentAnswer = converter.convertTextInputToAnswer({
                textInput,
                wordIndex,
                currentAnswer,
                title,
            });

            expect(newCurrentAnswer).toBe('e||');
        });

        it('should convert when there was no character before, second word', () => {
            const currentAnswer = '';
            const wordIndex = 4;
            const textInput = 'e';

            const newCurrentAnswer = converter.convertTextInputToAnswer({
                textInput,
                wordIndex,
                currentAnswer,
                title,
            });

            expect(newCurrentAnswer).toBe('|e|');
        });

        it('should convert when there was an answer before, for the first word', () => {
            const currentAnswer = 'le||';
            const wordIndex = 4;
            const textInput = 'la';

            const newCurrentAnswer = converter.convertTextInputToAnswer({
                textInput,
                wordIndex,
                currentAnswer,
                title,
            });

            expect(newCurrentAnswer).toBe('le|la|');
        });

        it('should convert when there was an answer before, for the second word', () => {
            const currentAnswer = '|la|';
            const wordIndex = 2;
            const textInput = 'le';

            const newCurrentAnswer = converter.convertTextInputToAnswer({
                textInput,
                wordIndex,
                currentAnswer,
                title,
            });

            expect(newCurrentAnswer).toBe('le|la|');
        });
    });

    describe('convertAnswerToTextInputs', () => {
        it('should convert when there is no answer', () => {
            const currentAnswer = '';

            const textInputs = converter.convertAnswerToTextInputs({
                currentAnswer,
                title,
            });

            expect(textInputs).toEqual(['', '', '']);
        });

        it('should convert when there is only one character, second word', () => {
            const currentAnswer = '|e|';

            const textInputs = converter.convertAnswerToTextInputs({
                currentAnswer,
                title,
            });

            expect(textInputs).toEqual(['', 'e', '']);
        });

        it('should convert when there are two answers, first second words', () => {
            const currentAnswer = 'le|la|';

            const newCurrentAnswer = converter.convertAnswerToTextInputs({
                currentAnswer,
                title,
            });

            expect(newCurrentAnswer).toEqual(['le', 'la', '']);
        });

        it('should convert when there are two answers, last second words', () => {
            const currentAnswer = '|la|les';

            const newCurrentAnswer = converter.convertAnswerToTextInputs({
                currentAnswer,
                title,
            });

            expect(newCurrentAnswer).toEqual(['', 'la', 'les']);
        });

        it('should convert when there are three answers', () => {
            const currentAnswer = 'le|la|les';

            const newCurrentAnswer = converter.convertAnswerToTextInputs({
                currentAnswer,
                title,
            });

            expect(newCurrentAnswer).toEqual(['le', 'la', 'les']);
        });
    });

    describe('convertWordIndexToAnswerIndex', () => {
        it('should return 0 for first word', () => {
            const wordIndex = 2;

            const answerIndex = converter.convertWordIndexToAnswerIndex({ wordIndex, title });

            expect(answerIndex).toBe(0);
        });

        it('should return 1 for second word', () => {
            const wordIndex = 4;

            const answerIndex = converter.convertWordIndexToAnswerIndex({ wordIndex, title });

            expect(answerIndex).toBe(1);
        });

        it('should return 2 for third word', () => {
            const wordIndex = 8;

            const answerIndex = converter.convertWordIndexToAnswerIndex({ wordIndex, title });

            expect(answerIndex).toBe(2);
        });

        it('should return -1 for error', () => {
            const wordIndex = 1;

            const answerIndex = converter.convertWordIndexToAnswerIndex({ wordIndex, title });

            expect(answerIndex).toBe(-1);
        });
    });

    describe('convertBlankedTitleToFullTitle', () => {
        it('should return original title if no blank', () => {
            const acceptableAnswers: acceptableAnswerType[][] = [];
            const blankedTitle = 'tu es la plus belle';

            const fullTitle = converter.convertBlankedTitleToFullTitle(
                blankedTitle,
                acceptableAnswers,
            );

            expect(fullTitle).toBe(blankedTitle);
        });

        it('should return original title if discrepancy in acceptable answers', () => {
            const acceptableAnswers: acceptableAnswerType[][] = [[{ answer: 'la', grade: 'A' }]];
            const blankedTitle = 'tu es la plus belle';

            const fullTitle = converter.convertBlankedTitleToFullTitle(
                blankedTitle,
                acceptableAnswers,
            );

            expect(fullTitle).toBe(blankedTitle);
        });

        it('should return full title if one blank', () => {
            const acceptableAnswers: acceptableAnswerType[][] = [[{ answer: 'la', grade: 'A' }]];
            const blankedTitle = 'tu es Ø plus belle';

            const fullTitle = converter.convertBlankedTitleToFullTitle(
                blankedTitle,
                acceptableAnswers,
            );

            expect(fullTitle).toBe('tu es la plus belle');
        });
    });
});
