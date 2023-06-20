function splitQuestionTrou(questionText: string) {
    const REGEX = /(\.{3,}|…)+/;

    const result = questionText.split(REGEX);
    if (result.length < 3) {
        return undefined;
    }

    return { beforeText: result[0].trim(), afterText: result[2].trim() };
}

export { splitQuestionTrou };
