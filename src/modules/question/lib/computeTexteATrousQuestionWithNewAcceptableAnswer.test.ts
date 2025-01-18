import { Question } from '../Question.entity';
import { computeTexteATrousQuestionWithNewAcceptableAnswer } from './computeTexteATrousQuestionWithNewAcceptableAnswer';

describe('computeTexteATrousQuestionWithNewAcceptableAnswer', () => {
    it('should add the acceptable answer for a blank', () => {
        const question = new Question();
        question.id = 1;
        question.kind = 'texteATrous';
        question.title = 'la vie Ø belle; ne trouves-tu Ø ?';
        question.points = 2;
        question.order = 0;
        question.acceptableAnswers = ['A:ZXN0', 'A:cGFz'];

        const updatedQuestion = computeTexteATrousQuestionWithNewAcceptableAnswer(question, {
            acceptableAnswer: { answer: 'point', grade: 'B' },
            blankIndex: 1,
        });

        expect(updatedQuestion.acceptableAnswers).toEqual(['A:ZXN0', 'A:cGFz|B:cG9pbnQ=']);
    });
});
