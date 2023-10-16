import SaveAltIcon from '@mui/icons-material/SaveAlt';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { questionKindType } from '../../types';
import { ElementType } from 'react';

const questionKindIconComponentMapping: Record<questionKindType, ElementType> = {
    qcm: RadioButtonCheckedIcon,
    questionTrou: SaveAltIcon,
    phraseMelangee: LowPriorityIcon,
};

export { questionKindIconComponentMapping };
