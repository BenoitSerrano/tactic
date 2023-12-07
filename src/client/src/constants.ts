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

const localeInfo = { locale: 'fr-FR', timeZone: 'Europe/Paris' };

const questionSpecificityMapping: Record<
    questionKindType,
    {
        label: string;
        description: string;
        IconComponent: ElementType;
    }
> = {
    qcm: {
        label: 'QCM',
        description:
            "L'étudiant devra choisir entre plusieurs réponses possibles. Une seule réponse correcte.",
        IconComponent: RadioButtonCheckedIcon,
    },
    questionTrou: {
        label: 'Phrase à trou',
        description:
            "L'étudiant devra combler le trou dans un texte. Plusieurs réponses correctes possibles.",
        IconComponent: SaveAltIcon,
    },
    texteATrous: {
        label: 'Texte à trous',
        description:
            "L'étudiant devra combler les trous dans un texte. Une seule réponse correcte par trou.",
        IconComponent: PasswordIcon,
    },
    phraseMelangee: {
        label: 'Phrase à reconstituer',
        description:
            "L'étudiant devra reformer une phrase à partir de mots mélangés. Plusieurs réponses correctes possibles.",
        IconComponent: LowPriorityIcon,
    },
    texteLibre: {
        label: 'Texte libre',
        description:
            "L'étudiant devra répondre à une question à partir d'un énoncé. Pas de correction automatique possible, vous devrez noter individuellement les copies.",
        IconComponent: KeyboardIcon,
    },
};

export {
    questionSpecificityMapping,
    FLOATING_NUMBER_REGEX,
    INTEGER_NUMBER_REGEX,
    QUESTION_TROU_REGEX,
    TEXTE_A_TROU_REGEX,
    HEADER_HEIGHT,
    localeInfo,
    manualQuestionKinds,
};
