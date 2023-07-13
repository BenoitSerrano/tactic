import { computeQuestionTrouStatus } from './computeQuestionTrouStatus';

describe('computeQuestionTrouStatus', () => {
    it('should return wrong for exact match', () => {
        const answer = 'truc';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionTrouStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('wrong');
    });

    it('should return acceptable for exact match', () => {
        const answer = 'chouette';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionTrouStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('acceptable');
    });

    it('should return right for exact match', () => {
        const answer = 'chose';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionTrouStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo case', () => {
        const answer = 'cHoSe';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionTrouStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo trailing space', () => {
        const answer = ' chose ';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionTrouStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo space after apostrophe', () => {
        const answer = "c' est";
        const rightAnswers = ["c'est"];
        const acceptableAnswers: string[] = [];
        const status = computeQuestionTrouStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });
});
