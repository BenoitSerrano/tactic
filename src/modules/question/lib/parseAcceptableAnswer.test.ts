import { acceptableAnswerParser } from './acceptableAnswerParser';

describe('acceptableAnswerParser', () => {
    describe('parse', () => {
        it('should parse an acceptableAnswer', () => {
            const acceptableAnswer = '1.5:machin';

            const { points, answer } = acceptableAnswerParser.parse(acceptableAnswer);

            expect(points).toBe(1.5);
            expect(answer).toBe('machin');
        });
    });

    describe('stringify', () => {
        it('should stringify an acceptableAnswer', () => {
            const points = 1.5;
            const answer = 'machin';

            const acceptableAnswer = acceptableAnswerParser.stringify(points, answer);

            expect(acceptableAnswer).toBe('1.5:machin');
        });
    });
});
