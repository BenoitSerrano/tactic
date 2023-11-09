import { ElementType } from 'react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PasswordIcon from '@mui/icons-material/Password';
import { questionKindType } from './types';

const FLOATING_NUMBER_REGEX = /^[0-9]?(\.)?([0-9]*)?$/;
const INTEGER_NUMBER_REGEX = /^[0-9]*$/;

const QUESTION_TROU_REGEX = /^(.*)\.{4}(.*)$/;
const TEXTE_A_TROU_REGEX = /(\.{4})/g;
const HEADER_HEIGHT = 60;

const manualQuestionKinds = ['texteLibre'];

const questionSpecificityMapping: Record<
    questionKindType,
    {
        label: string;
        IconComponent: ElementType;
    }
> = {
    qcm: {
        label: 'QCM',
        IconComponent: RadioButtonCheckedIcon,
    },
    questionTrou: {
        label: 'Question / réponse',
        IconComponent: SaveAltIcon,
    },
    phraseMelangee: {
        label: 'Phrase à reconstituer',
        IconComponent: LowPriorityIcon,
    },
    texteLibre: {
        label: 'Texte libre',
        IconComponent: KeyboardIcon,
    },
    texteATrous: {
        label: 'Texte à trous',
        IconComponent: PasswordIcon,
    },
};

export {
    questionSpecificityMapping,
    FLOATING_NUMBER_REGEX,
    INTEGER_NUMBER_REGEX,
    QUESTION_TROU_REGEX,
    TEXTE_A_TROU_REGEX,
    HEADER_HEIGHT,
    manualQuestionKinds,
};
