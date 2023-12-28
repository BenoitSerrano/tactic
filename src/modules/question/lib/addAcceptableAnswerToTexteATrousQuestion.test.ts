import { Question } from '../Question.entity';
import { addAcceptableAnswerToTexteATrousQuestion } from './addAcceptableAnswerToTexteATrousQuestion';

describe('addAcceptableAnswerToTexteATrousQuestion', () => {
    it('should add the acceptable answer for a blank', () => {
        const question = new Question();
        question.id = 1;
        question.kind = 'texteATrous';
        question.title = 'la vie .... belle; ne trouves-tu .... ?';
        question.points = 2;
        question.order = 0;
        question.acceptableAnswers = ['A:ZXN0', 'A:cGFz'];

        const updatedQuestion = addAcceptableAnswerToTexteATrousQuestion(question, {
            acceptableAnswer: { answer: 'point', grade: 'B' },
            blankIndex: 1,
        });

        expect(updatedQuestion.acceptableAnswers).toEqual(['A:ZXN0', 'A:cGFz|B:cG9pbnQ=']);
    });
});
