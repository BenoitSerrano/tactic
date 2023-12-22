import { acceptableAnswerParser } from './acceptableAnswerParser';

describe('acceptableAnswerParser', () => {
    describe('parse', () => {
        it('should parse an acceptableAnswer', () => {
            const acceptableAnswer = 'B:machin';

            const { grade, answer } = acceptableAnswerParser.parse(acceptableAnswer);

            expect(grade).toBe('B');
            expect(answer).toBe('machin');
        });
    });

    describe('stringify', () => {
        it('should stringify an acceptableAnswer', () => {
            const grade = 'B';
            const answer = 'machin';

            const acceptableAnswer = acceptableAnswerParser.stringify({ grade, answer });

            expect(acceptableAnswer).toBe('B:machin');
        });
    });
});
