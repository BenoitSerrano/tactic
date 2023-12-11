import { computeAutomaticMark } from './computeAutomaticMark';

describe(`computeAutomaticMark`, () => {
    const points = 60;

    it(`should return 1/4 points for 1/4 right answers`, () => {
        const answer = `le|la|les|lu`;
        const questionKind = `texteATrous`;
        const acceptableAnswersWithPoints = [
            `${points / 4}:truc`,
            `${points / 4}:machin`,
            `${points / 4}:bidule`,
            `${points / 4}:lu`,
        ];

        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(15);
    });

    it(`should return 1/4 points if only one answer has been saved`, () => {
        const answer = `le|||`;
        const questionKind = `texteATrous`;
        const acceptableAnswersWithPoints = [
            `${points / 4}:le`,
            `${points / 4}:machin`,
            `${points / 4}:bidule`,
            `${points / 4}:lu`,
        ];

        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(15);
    });

    it(`should throw error if no right answer provided`, () => {
        const answer = `truc`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints: string[] = [];

        expect(() =>
            computeAutomaticMark({
                questionKind,

                answer,
                acceptableAnswersWithPoints,
            }),
        ).toThrowError();
    });

    it(`should return wrong for exact match`, () => {
        const answer = `truc`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [
            `${points}:machin`,
            `${points}:chose`,
            `${points / 2}:bidule`,
            `${points / 2}:chouette`,
        ];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(0);
    });

    it(`should return acceptable for exact match`, () => {
        const questionKind = `questionTrou`;
        const answer = `chouette`;
        const acceptableAnswersWithPoints = [
            `${points}:machin`,
            `${points}:chose`,
            `${points / 2}:bidule`,
            `${points / 2}:chouette`,
        ];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(30);
    });

    it(`should return right for exact match`, () => {
        const answer = `chose`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [
            `${points}:machin`,
            `${points}:chose`,
            `${points / 2}:bidule`,
            `${points / 2}:chouette`,
        ];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo case`, () => {
        const answer = `cHoSe`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [
            `${points}:machin`,
            `${points}:chose`,
            `${points / 2}:bidule`,
            `${points / 2}:chouette`,
        ];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo trailing space`, () => {
        const answer = ` chose `;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [
            `${points}:machin`,
            `${points}:chose`,
            `${points / 2}:bidule`,
            `${points / 2}:chouette`,
        ];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo space after apostrophe`, () => {
        const answer = "c' est";
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [points + ":c'est"];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo different apostrophe`, () => {
        const answer = `c’est`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [points + ":c'est"];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo multiple spaces in a row`, () => {
        const answer = "s'être  levé";
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [points + ":s'être levé"];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo same-looking accent é`, () => {
        const answer = `a sonné`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [`${points}:a sonné`];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo same-looking accent ê`, () => {
        const answer = `s’être levé`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [`${points}:s'être levé`];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo presence of period`, () => {
        const answer = "s'être levé.";
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [`${points}:s'être levé`];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });

    it(`should return right for match modulo apostrophe and space before`, () => {
        const answer = `it ’s still nice you can get on with an ex if boyfriend`;
        const questionKind = `questionTrou`;
        const acceptableAnswersWithPoints = [
            `${points}:it 's still nice you can get on with an ex if boyfriend`,
        ];
        const mark = computeAutomaticMark({
            questionKind,

            answer,
            acceptableAnswersWithPoints,
        });

        expect(mark).toBe(60);
    });
});
