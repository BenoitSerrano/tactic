import { convertGradeToMark } from '../../../../lib/convertGradeToMark';
import { gradeType } from '../../../../types';

function computeDisplayedMark(props: {
    grade: gradeType | undefined;
    answer: string | undefined;
    totalPoints: number;
    isQuestionManuallyCorrected: boolean;
}): string {
    let displayedMark;
    if (props.isQuestionManuallyCorrected) {
        if (props.grade !== undefined) {
            displayedMark = convertGradeToMark(props.grade, props.totalPoints);
        } else {
            if (props.answer) {
                displayedMark = '...';
            } else {
                displayedMark = 0;
            }
        }
    } else {
        displayedMark = convertGradeToMark(props.grade || 'E', props.totalPoints);
    }
    return `${displayedMark} / ${props.totalPoints}`;
}

export { computeDisplayedMark };
