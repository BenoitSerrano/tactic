import SaveAltIcon from '@mui/icons-material/SaveAlt';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { questionKindType } from '../../types';
import { ElementType } from 'react';
import { QCMUpsertionModalContent } from './QCMUpsertionModalContent';
import { QuestionTrouUpsertionModalContent } from './QuestionTrouUpsertionModalContent';
import { PhraseMelangeeUpsertionModalContent } from './PhraseMelangeeUpsertionModalContent';
import { TexteLibreUpsertionModalContent } from './TexteLibreUpsertionModalContent';

const questionSpecicityMapping: Record<
    questionKindType,
    {
        defaultPoints: string;
        QuestionUpsertionModalContentComponent: ElementType;
        label: string;
        IconComponent: ElementType;
    }
> = {
    qcm: {
        label: 'QCM',
        defaultPoints: '1.0',
        IconComponent: RadioButtonCheckedIcon,
        QuestionUpsertionModalContentComponent: QCMUpsertionModalContent,
    },
    questionTrou: {
        label: 'Texte à trou',
        defaultPoints: '2.0',
        IconComponent: SaveAltIcon,
        QuestionUpsertionModalContentComponent: QuestionTrouUpsertionModalContent,
    },
    phraseMelangee: {
        label: 'Phrase à reconstituer',
        defaultPoints: '3.0',
        IconComponent: LowPriorityIcon,
        QuestionUpsertionModalContentComponent: PhraseMelangeeUpsertionModalContent,
    },
    texteLibre: {
        label: 'Texte libre',
        defaultPoints: '3.0',
        IconComponent: KeyboardIcon,
        QuestionUpsertionModalContentComponent: TexteLibreUpsertionModalContent,
    },
};

const SPLITTING_CHARACTER_FOR_ANSWERS = ';';

export { questionSpecicityMapping, SPLITTING_CHARACTER_FOR_ANSWERS };
