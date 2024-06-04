import { TextField, styled } from '@mui/material';
import { useState } from 'react';

function AutoBlurringTextField(props: {
    isMultiline?: boolean;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    isFullWidth?: boolean;
    width?: number;
}) {
    const [isTextInputFocused, setIsTextInputFocused] = useState(false);

    return (
        <StyledTextField
            width={props.width}
            fullWidth={props.isFullWidth}
            onBlur={onBlur}
            focused={isTextInputFocused}
            onFocus={onFocus}
            multiline={props.isMultiline}
            placeholder="..."
            value={props.value}
            onChange={onChange}
        />
    );

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.value);
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
    flex: 1,
    width: props.width,
    '& .MuiInputBase-input': {
        filter: props.focused ? 'none' : 'blur(3px)',
    },
    '&:hover': {
        color: 'red',
        '& .MuiInputBase-input': {
            filter: 'none',
        },
    },
}));

export { AutoBlurringTextField };
