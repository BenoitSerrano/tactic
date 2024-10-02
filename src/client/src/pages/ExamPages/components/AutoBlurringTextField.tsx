import { TextField, styled } from '@mui/material';
import { useRef, useState } from 'react';
import { AccentVirtualKeyboard } from './AccentVirtualKeyboard/AccentVirtualKeyboard';
import { addCharacterAtPosition } from './AccentVirtualKeyboard/lib/addCharacterAtPosition';

function AutoBlurringTextField(props: {
    isMultiline?: boolean;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    isFullWidth?: boolean;
    width?: number;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isTextInputFocused, setIsTextInputFocused] = useState(false);
    return (
        <Container isFullWidth={props.isFullWidth} width={props.width}>
            <StyledTextField
                inputRef={inputRef}
                width={props.width}
                fullWidth={props.isFullWidth}
                onBlur={onBlur}
                onPaste={(event) => event.preventDefault()}
                focused={isTextInputFocused}
                onFocus={onFocus}
                multiline={props.isMultiline}
                placeholder="..."
                value={props.value}
                onChange={onChange}
            />
            {isTextInputFocused && <AccentVirtualKeyboard onAddCharacter={onAddCharacter} />}
        </Container>
    );

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.value);
    }

    function onAddCharacter(character: string) {
        const currentInput = inputRef?.current;
        if (
            !currentInput ||
            currentInput.selectionStart === undefined ||
            currentInput.selectionStart === null
        ) {
            return;
        }
        const selectionIndex = currentInput.selectionStart;

        const newText = addCharacterAtPosition(character, selectionIndex, props.value);
        props.onChange(newText);
    }

    function onFocus() {
        setIsTextInputFocused(true);
    }

    function onBlur() {
        setIsTextInputFocused(false);
        if (props.onBlur) {
            props.onBlur();
        }
    }
}

const StyledTextField = styled(TextField)<{ width?: number }>((props) => ({
    width: props.width,
    flex: 1,
    '& .MuiInputBase-input': {
        filter:
            props.focused || props.value === undefined || props.value === '' ? 'none' : 'blur(3px)',
    },
    '&:hover': {
        '& .MuiInputBase-input': {
            filter: 'none',
        },
    },
}));

const Container = styled('div')<{ isFullWidth: boolean | undefined; width: number | undefined }>(
    ({ theme, isFullWidth }) => ({
        display: 'flex',
        position: 'relative',
        width: isFullWidth ? '100%' : undefined,
    }),
);

export { AutoBlurringTextField };
