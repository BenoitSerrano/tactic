import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { ElementType } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { gradeType } from '../../../types';

type attributeGradeToAnswerActionType = {
    name: string;
    grade: gradeType;
    IconComponent: ElementType;
    color: 'success' | 'error' | 'warning';
};
const attributeGradeToAnswerActions: attributeGradeToAnswerActionType[] = [
    {
        name: 'fausse',
        grade: 'E',
        IconComponent: ClearIcon,
        color: 'error',
    },
    {
        name: 'passable',
        grade: 'D',
        IconComponent: SentimentVeryDissatisfiedIcon,
        color: 'warning',
    },
    {
        name: 'moyenne',
        grade: 'C',
        IconComponent: SentimentNeutralIcon,
        color: 'warning',
    },
    {
        name: 'acceptable',
        grade: 'B',
        IconComponent: SentimentSatisfiedAltIcon,
        color: 'warning',
    },
    {
        name: 'correcte',
        grade: 'A',
        IconComponent: CheckIcon,
        color: 'success',
    },
];

export { attributeGradeToAnswerActions };
