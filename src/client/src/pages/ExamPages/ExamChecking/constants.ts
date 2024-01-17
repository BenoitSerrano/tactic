import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { ElementType } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { gradeType } from '../../../types';

type attributeGradeToAnswerActionType = {
    grade: gradeType;
    IconComponent: ElementType;
    color: 'success' | 'error' | 'warning';
};
const attributeGradeToAnswerActions: attributeGradeToAnswerActionType[] = [
    {
        grade: 'E',
        IconComponent: ClearIcon,
        color: 'error',
    },
    {
        grade: 'D',
        IconComponent: SentimentVeryDissatisfiedIcon,
        color: 'warning',
    },
    {
        grade: 'C',
        IconComponent: SentimentNeutralIcon,
        color: 'warning',
    },
    {
        grade: 'B',
        IconComponent: SentimentSatisfiedAltIcon,
        color: 'warning',
    },
    {
        grade: 'A',
        IconComponent: CheckIcon,
        color: 'success',
    },
];

export { attributeGradeToAnswerActions };
