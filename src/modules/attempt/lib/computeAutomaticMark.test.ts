import { acceptableAnswerType } from '../../question/types';
import { computeAutomaticMark } from './computeAutomaticMark';

describe(`computeAutomaticMark`, () => {
    const points = 60;
    const baseQuestionDto = {
        id: 1,
        title: 'tu .... es',
        order: 1,
        possibleAnswers: [],
        grade: 'A',
        points,
    };

    it(`should return 1/4 points for 1/4 right answers`, () => {
        const answer = `le|la|les|lu`;
        const questionKind = `texteATrous` as const;
        const acceptableAnswers = [
            { grade: 'D', answer: 'truc' },
            { grade: 'D', answer: 'machin' },
            { grade: 'D', answer: 'bidule' },
            { grade: 'D', answer: 'lu' },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,
            answer,
        });

        expect(mark).toBe(15);
    });

    it(`should return 1/4 points if only one answer has been saved`, () => {
        const answer = `le|||`;
        const questionKind = `texteATrous` as const;
        const acceptableAnswers = [
            { grade: 'D', answer: 'le' },
            { grade: 'D', answer: 'machin' },
            { grade: 'D', answer: 'bidule' },
            { grade: 'D', answer: 'lu' },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(15);
    });

    it(`should throw error if no right answer provided`, () => {
        const answer = `truc`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers: acceptableAnswerType[] = [];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        expect(() =>
            computeAutomaticMark({
                questionDto,
                answer,
            }),
        ).toThrowError();
    });

    it(`should return wrong for exact match`, () => {
        const answer = `truc`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [
            { grade: 'A', answer: 'machin' },
            { grade: 'A', answer: 'chose' },
            { grade: 'C', answer: 'bidule' },
            { grade: 'C', answer: 'chouette' },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(0);
    });

    it(`should return acceptable for exact match`, () => {
        const questionKind = `questionReponse` as const;
        const answer = `chouette`;
        const acceptableAnswers = [
            { grade: 'A', answer: 'machin' },
            { grade: 'A', answer: 'chose' },
            { grade: 'C', answer: 'bidule' },
            { grade: 'C', answer: 'chouette' },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(30);
    });

    it(`should return right for exact match`, () => {
        const answer = `chose`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [
            { grade: 'A', answer: 'machin' },
            { grade: 'A', answer: 'chose' },
            { grade: 'C', answer: 'bidule' },
            { grade: 'C', answer: 'chouette' },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo case`, () => {
        const answer = `cHoSe`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [
            { grade: 'A', answer: 'machin' },
            { grade: 'A', answer: 'chose' },
            { grade: 'C', answer: 'bidule' },
            { grade: 'C', answer: 'chouette' },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo trailing space`, () => {
        const answer = ` chose `;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [
            { grade: 'A', answer: 'machin' },
            { grade: 'A', answer: 'chose' },
            { grade: 'C', answer: 'bidule' },
            { grade: 'C', answer: 'chouette' },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo space after apostrophe`, () => {
        const answer = "c' est";
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [{ grade: 'A', answer: "c'est" }] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo different apostrophe`, () => {
        const answer = `c’est`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [{ grade: 'A', answer: "c'est" }] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,
            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo multiple spaces in a row`, () => {
        const answer = "s'être  levé";
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [{ grade: 'A', answer: "s'être levé" }] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo same-looking accent é`, () => {
        const answer = `a sonné`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [{ grade: 'A', answer: 'a sonné' }] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,
            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo same-looking accent ê`, () => {
        const answer = `s’être levé`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [{ grade: 'A', answer: "s'être levé" }] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo presence of period`, () => {
        const answer = "s'être levé.";
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [{ grade: 'A', answer: "s'être levé" }] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo apostrophe and space before`, () => {
        const answer = `it ’s still nice you can get on with an ex if boyfriend`;
        const questionKind = `questionReponse` as const;
        const acceptableAnswers = [
            { grade: 'A', answer: "it 's still nice you can get on with an ex if boyfriend" },
        ] as acceptableAnswerType[];
        const questionDto = { ...baseQuestionDto, kind: questionKind, acceptableAnswers };

        const { mark } = computeAutomaticMark({
            questionDto,

            answer,
        });

        expect(mark).toBe(60);
    });
});
