import { computeAutomaticMark } from './computeAutomaticMark';

describe('computeAutomaticMark', () => {
    const points = 60;

    it('should return 1/4 points for 1/4 right answers', () => {
        const answer = 'le la les lu';
        const questionKind = 'texteATrous';
        const rightAnswers = ['truc', 'machin', 'bidule', 'lu'];
        const acceptableAnswers: string[] = [];

        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(15);
    });

    it('should return 1/4 points if only one answer has been saved', () => {
        const answer = 'le   ';
        const questionKind = 'texteATrous';
        const rightAnswers = ['le', 'machin', 'bidule', 'lu'];
        const acceptableAnswers: string[] = [];

        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(15);
    });

    it('should throw error if no right answer provided', () => {
        const answer = 'truc';
        const questionKind = 'texteLibre';
        const rightAnswers: string[] = [];
        const acceptableAnswers = ['bidule', 'chouette'];

        expect(() =>
            computeAutomaticMark({
                questionKind,
                points,
                answer,
                rightAnswers,
                acceptableAnswers,
            }),
        ).toThrowError();
    });

    it('should return wrong for exact match', () => {
        const answer = 'truc';
        const questionKind = 'questionTrou';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(0);
    });

    it('should return acceptable for exact match', () => {
        const questionKind = 'questionTrou';
        const answer = 'chouette';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(30);
    });

    it('should return right for exact match', () => {
        const answer = 'chose';
        const questionKind = 'questionTrou';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo case', () => {
        const answer = 'cHoSe';
        const questionKind = 'questionTrou';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo trailing space', () => {
        const answer = ' chose ';
        const questionKind = 'questionTrou';
        const rightAnswers = ['machin', 'chose'];
        const acceptableAnswers = ['bidule', 'chouette'];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo space after apostrophe', () => {
        const answer = "c' est";
        const questionKind = 'questionTrou';
        const rightAnswers = ["c'est"];
        const acceptableAnswers: string[] = [];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo different apostrophe', () => {
        const answer = 'c’est';
        const questionKind = 'questionTrou';
        const rightAnswers = ["c'est"];
        const acceptableAnswers: string[] = [];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo multiple spaces in a row', () => {
        const answer = "s'être  levé";
        const questionKind = 'questionTrou';
        const rightAnswers = ["s'être levé"];
        const acceptableAnswers: string[] = [];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo same-looking accent é', () => {
        const answer = 'a sonné';
        const questionKind = 'questionTrou';
        const rightAnswers = ['a sonné'];
        const acceptableAnswers: string[] = [];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo same-looking accent ê', () => {
        const answer = 's’être levé';
        const questionKind = 'questionTrou';
        const rightAnswers = ["s'être levé"];
        const acceptableAnswers: string[] = [];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });

    it('should return right for match modulo presence of period', () => {
        const answer = "s'être levé.";
        const questionKind = 'questionTrou';
        const rightAnswers = ["s'être levé"];
        const acceptableAnswers: string[] = [];
        const mark = computeAutomaticMark({
            questionKind,
            points,
            answer,
            rightAnswers,
            acceptableAnswers,
        });

        expect(mark).toBe(60);
    });
});
