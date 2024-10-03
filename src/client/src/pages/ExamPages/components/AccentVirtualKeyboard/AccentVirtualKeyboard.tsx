import { useState } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import { styled } from '@mui/material';
import { AccentKey } from './AccentKey';
import { IconButton } from '../../../../components/IconButton';

const ACCENTS = ['à', 'â', 'é', 'è', 'ê', 'î', 'ï', 'ô', 'û', 'ù'];

function AccentVirtualKeyboard(props: { onAddCharacter: (character: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    return isOpen ? (
        <KeyboardContainer onMouseLeave={closeKeyboardLayout}>
            <KeysContainer>
                {ACCENTS.map((accent) => (
                    <AccentKey onAddCharacter={props.onAddCharacter} value={accent} key={accent} />
                ))}
            </KeysContainer>
        </KeyboardContainer>
    ) : (
        <IconContainer>
            <IconButton
                onMouseEnter={openKeyboardLayout}
                IconComponent={TranslateIcon}
                onClick={openKeyboardLayout}
                title="Ouvrir le clavier virtuel des accents"
            />
        </IconContainer>
    );

    function openKeyboardLayout() {
        setIsOpen(true);
    }

    function closeKeyboardLayout() {
        setIsOpen(false);
    }
}

const KeyboardContainer = styled('div')(({ theme }) => ({
    background: theme.palette.common.white,
    borderRadius: '2px',
    position: 'absolute',
    zIndex: 1,
    boxShadow: theme.shadows[1],
    [theme.breakpoints.up('md')]: {
        marginLeft: '100%',
    },
    [theme.breakpoints.down('md')]: {
        right: 0,
    },
}));
const IconContainer = styled('div')(({ theme }) => ({
    position: 'absolute',
    display: 'flex',
    background: '#ffffffbb',
    top: theme.spacing(1),

    [theme.breakpoints.up('md')]: {
        marginLeft: '100%',
    },
    [theme.breakpoints.down('md')]: {
        right: 0,
    },
}));
const KeysContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '15vw',
    justifyContent: 'center',
    flexWrap: 'wrap',
}));

export { AccentVirtualKeyboard };
