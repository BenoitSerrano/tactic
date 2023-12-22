import { gradeType } from '../types';

function convertGradeToMark(grade: gradeType, totalPoints: number) {
    switch (grade) {
        case 'A':
            return totalPoints;
        case 'B':
            return totalPoints * 0.75;
        case 'C':
            return totalPoints * 0.5;
        case 'D':
            return totalPoints * 0.25;
        case 'E':
            return 0;
    }
}
export { convertGradeToMark };
