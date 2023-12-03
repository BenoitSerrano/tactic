import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, TextField, styled } from '@mui/material';
import { useState } from 'react';
import { time } from '../../lib/time';
import { INTEGER_NUMBER_REGEX } from '../../constants';

function EditableTime(props: { initialValue: number; changeValue: (newValue: number) => void }) {
    const [value, setValue] = useState(props.initialValue);
    const [isEditing, setIsEditing] = useState(false);
    const displayedValue = time.formatToClock(value * 60);
    return isEditing ? (
        <Container>
            <StyledTextField
                autoFocus
                onBlur={confirmChanges}
                variant="standard"
                value={value}
                onChange={onChange}
            />
            minutes
            <IconButton onClick={confirmChanges}>
                <CheckIcon />
            </IconButton>
        </Container>
    ) : (
        <Container>
            <span>{displayedValue}</span>
            <IconButton onClick={activateEditing}>
                <EditIcon />
            </IconButton>
        </Container>
    );

    function confirmChanges() {
        props.changeValue(value);
        setIsEditing(false);
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newDuration = event.target.value;
        if (newDuration.match(INTEGER_NUMBER_REGEX)) {
            setValue(Number(newDuration));
        }
    }

    function activateEditing() {
        setIsEditing(true);
    }
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const StyledTextField = styled(TextField)({ width: 40 });

export { EditableTime };
