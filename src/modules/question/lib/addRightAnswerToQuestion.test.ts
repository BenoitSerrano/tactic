import { Question } from '../Question.entity';
import { addRightAnswerToQuestion } from './addRightAnswerToQuestion';
import { questionEncoder } from './questionEncoder';

describe('addRightAnswerToQuestion', () => {
    const question = new Question();
    question.possibleAnswers = [];
    question.rightAnswers = ['une bonne réponse'];
    question.acceptableAnswers = ['une réponse acceptable'];
    const encodedQuestion = questionEncoder.encodeQuestion(question);
    it('should add the right answer', () => {
        const updatedQuestion = addRightAnswerToQuestion(
            encodedQuestion,
            'une nouvelle bonne réponse',
        );
        const decodedUpdatedQuestion = questionEncoder.decodeQuestion(updatedQuestion);
        expect(decodedUpdatedQuestion.acceptableAnswers).toEqual(['une réponse acceptable']);
        expect(decodedUpdatedQuestion.rightAnswers).toEqual([
            'une bonne réponse',
            'une nouvelle bonne réponse',
        ]);
    });

    it('should add the right answer and delete the answer from acceptableAnswers', () => {
        const updatedQuestion = addRightAnswerToQuestion(encodedQuestion, 'une réponse acceptable');
        const decodedUpdatedQuestion = questionEncoder.decodeQuestion(updatedQuestion);
        expect(decodedUpdatedQuestion.acceptableAnswers).toEqual([]);
        expect(decodedUpdatedQuestion.rightAnswers).toEqual([
            'une bonne réponse',
            'une réponse acceptable',
        ]);
    });
});
