import { Question } from '../Question.entity';
import { removeOkAnswerFromQuestionFromTexteATrousQuestion } from './removeOkAnswerFromQuestionFromTexteATrousQuestion';

describe('removeOkAnswerFromQuestionFromTexteATrousQuestion', () => {
    it('should add the acceptable answer for a blank', () => {
        const question = new Question();
        question.id = 1;
        question.kind = 'texteATrous';
        question.title = 'la vie Ø belle; ne trouves-tu Ø ?';
        question.points = 2;
        question.order = 0;
        question.acceptableAnswers = ['A:ZXN0', 'A:cGFz|B:cG9pbnQ='];

        const updatedQuestion = removeOkAnswerFromQuestionFromTexteATrousQuestion(question, {
            blankIndex: 1,
            okAnswer: 'point',
        });

        expect(updatedQuestion.acceptableAnswers).toEqual(['A:ZXN0', 'A:cGFz']);
    });
});
