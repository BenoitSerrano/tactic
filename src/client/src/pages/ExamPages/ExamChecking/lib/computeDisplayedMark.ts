function computeDisplayedMark(props: {
    mark: number | undefined;
    answer: string | undefined;
    totalPoints: number;
    isQuestionManuallyCorrected: boolean;
}): string {
    let displayedMark;
    if (props.isQuestionManuallyCorrected) {
        if (props.mark !== undefined) {
            displayedMark = props.mark;
        } else {
            if (props.answer) {
                displayedMark = '...';
            } else {
                displayedMark = `${0}`;
            }
        }
    } else {
        displayedMark = `${props.mark}`;
    }
    return `${displayedMark} / ${props.totalPoints}`;
}

export { computeDisplayedMark };
