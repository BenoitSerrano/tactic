import { gradeType } from '../types';

const gradeConverter = {
    convertGradeToMark,
    convertGradeToStatus,
    convertGradeToAdjective,
    convertGradeToExplanation,
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

function convertGradeToExplanation(grade: gradeType) {
    switch (grade) {
        case 'A':
            return 'Vaut 100% de la note attribuée à la question';
        case 'B':
            return 'Vaut 75% de la note attribuée à la question';
        case 'C':
            return 'Vaut 50% de la note attribuée à la question';
        case 'D':
            return 'Vaut 25% de la note attribuée à la question';
    }
    return '';
}

function convertGradeToAdjective(grade: gradeType, options?: { isPlural?: boolean }): string {
    let adjective = '';
    switch (grade) {
        case 'A':
            adjective = 'correcte';
            break;
        case 'B':
            adjective = 'acceptable';
            break;
        case 'C':
            adjective = 'moyenne';
            break;
        case 'D':
            adjective = 'passable';
            break;
        case 'E':
            adjective = 'fausse';
            break;
    }
    return adjective + (options?.isPlural ? 's' : '');
}

export { gradeConverter };
