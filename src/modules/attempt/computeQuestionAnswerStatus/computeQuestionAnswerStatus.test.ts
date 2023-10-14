import { computeQuestionAnswerStatus } from './computeQuestionAnswerStatus';

describe('computeQuestionAnswerStatus', () => {
    it('should return wrong for exact match', () => {
        const answer = 'truc';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('wrong');
    });

    it('should return acceptable for exact match', () => {
        const answer = 'chouette';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('acceptable');
    });

    it('should return right for exact match', () => {
        const answer = 'chose';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo case', () => {
        const answer = 'cHoSe';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo trailing space', () => {
        const answer = ' chose ';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo space after apostrophe', () => {
        const answer = "c' est";
        const rightAnswers = ["c'est"];
        const acceptableAnswers: string[] = [];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo different apostrophe', () => {
        const answer = 'c’est';
        const rightAnswers = ["c'est"];
        const acceptableAnswers: string[] = [];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo multiple spaces in a row', () => {
        const answer = "s'être  levé";
        const rightAnswers = ["s'être levé"];
        const acceptableAnswers: string[] = [];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo same-looking accent é', () => {
        const answer = 'a sonné';
        const rightAnswers = ['a sonné'];
        const acceptableAnswers: string[] = [];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });

    it('should return right for match modulo same-looking accent ê', () => {
        const answer = 's’être levé';
        const rightAnswers = ["s'être levé"];
        const acceptableAnswers: string[] = [];
        const status = computeQuestionAnswerStatus(answer, rightAnswers, acceptableAnswers);

        expect(status).toBe('right');
    });
});
