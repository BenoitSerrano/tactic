import { gradeType } from '../types';

const gradeConverter = {
    convertGradeToMark,
    convertGradeToStatus,
};

function convertGradeToMark(grade: gradeType | undefined, totalPoints: number) {
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
    return undefined;
}

function convertGradeToStatus(grade: gradeType | undefined): 'right' | 'wrong' | 'acceptable' {
    if (grade === undefined || grade === 'E') {
        return 'wrong';
    }
    if (grade === 'A') {
        return 'right';
    }
    return 'acceptable';
}

export { gradeConverter };
