import { convertGradeToMark } from '../../../../lib/convertGradeToMark';
import { gradeType } from '../../../../types';

function computeDisplayedMark(props: {
    grade: gradeType | undefined;
    mark: number | undefined;
    answer: string | undefined;
    totalPoints: number;
}): string {
    if (props.grade) {
        const displayedMark = convertGradeToMark(props.grade, props.totalPoints);
        return `${displayedMark} / ${props.totalPoints}`;
    }
    if (props.mark === undefined) {
        const displayedMark = props.answer ? '...' : 0;
        return `${displayedMark} / ${props.totalPoints}`;
    }
    return `${props.mark} / ${props.totalPoints}`;
}

export { computeDisplayedMark };
