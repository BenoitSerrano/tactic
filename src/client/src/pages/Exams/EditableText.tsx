import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, TextField, styled } from '@mui/material';
import { useState } from 'react';

function EditableText(props: {
    initialText: string;
    isLoading: boolean;
    changeText: (newText: string) => void;
}) {
    const [text, setText] = useState(props.initialText);
    const [isEditing, setIsEditing] = useState(false);
    return isEditing ? (
        <Container>
            <TextField
                autoFocus
                onBlur={confirmChanges}
                variant="standard"
                value={text}
                fullWidth
                onChange={onChange}
            />
            <IconButton onClick={confirmChanges}>
                <CheckIcon />
            </IconButton>
        </Container>
    ) : (
        <Container>
            <span>{text}</span>
            <IconButton onClick={activateEditing}>
                <EditIcon />
            </IconButton>
        </Container>
    );

    function confirmChanges() {
        props.changeText(text);
        setIsEditing(false);
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    function activateEditing() {
        setIsEditing(true);
    }
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

export { EditableText };
