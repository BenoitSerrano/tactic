function computeSumPoints<questionT extends { points: number }>(questions: questionT[]) {
    return questions.reduce((sum, question) => question.points + sum, 0);
}
export { computeSumPoints };
