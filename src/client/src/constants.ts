import { ElementType } from 'react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PasswordIcon from '@mui/icons-material/Password';
import { questionKindType } from './types';

const FLOATING_NUMBER_REGEX = /^([0-9]+)?(\.)?([0-9]*)?$/;
const INTEGER_NUMBER_REGEX = /^[0-9]*$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const TAT_BLANK_STRING = 'Ø';
const NON_WORD_CHARACTERS = [
    ',',
    '.',
    '-',
    ';',
    ':',
    '!',
    '?',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '<',
    '>',
    '"',
];

const APOSTROPHES = ["'", '’', 'ʼ'];

const TEXTE_A_TROU_REGEX = /(Ø)/g;
const HEADER_HEIGHT = 60;
const BREADCRUMBS_HEIGHT = 60;

const manualQuestionKinds = ['texteLibre'];

const localeInfo = { locale: 'fr-FR', timeZone: 'Europe/Paris' };

type userRoleType = 'teacher' | 'admin';
type userInfoType = {
    email: string;
    remainingPapers: number;
    roles: userRoleType[];
};

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
    questionReponse: {
        label: 'Question / réponse',
        description:
            "L'étudiant devra répondre à une question. Plusieurs réponses correctes possibles.",
        IconComponent: SaveAltIcon,
    },
    texteLibre: {
        label: 'Texte libre',
        description:
            "L'étudiant devra répondre à une question. Pas de correction automatique possible, vous devrez noter individuellement les copies.",
        IconComponent: KeyboardIcon,
    },
};

export {
    questionSpecificityMapping,
    FLOATING_NUMBER_REGEX,
    UUID_REGEX,
    INTEGER_NUMBER_REGEX,
    TEXTE_A_TROU_REGEX,
    HEADER_HEIGHT,
    localeInfo,
    manualQuestionKinds,
    BREADCRUMBS_HEIGHT,
    TAT_BLANK_STRING,
    NON_WORD_CHARACTERS,
    APOSTROPHES,
};

export type { userRoleType, userInfoType };
