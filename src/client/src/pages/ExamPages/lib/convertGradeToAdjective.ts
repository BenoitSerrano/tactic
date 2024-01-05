import { gradeType } from '../../../types';

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

export { convertGradeToAdjective };
