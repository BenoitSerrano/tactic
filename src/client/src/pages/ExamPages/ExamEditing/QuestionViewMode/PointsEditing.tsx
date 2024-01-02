import { TextField, Typography, styled } from '@mui/material';
import { ChangeEvent } from 'react';
import { FLOATING_NUMBER_REGEX } from '../../../../constants';
import { formErrorHandler } from '../lib/formErrorHandler';
import { FormHelperText } from '../../../../components/FormHelperText';

function PointsEditing(props: {
    points: string;
    setPoints: (points: string) => void;
    formErrors: string[];
}) {
    const formErrorMessage = formErrorHandler.extractPointsFormErrorMessage(props.formErrors);
    return (
        <Container>
            <SlashText>/</SlashText>
            <StyledTextField
                error={!!formErrorMessage}
                helperText={<FormHelperText label={formErrorMessage} />}
                variant="standard"
                value={props.points}
                onChange={onChange}
            />
        </Container>
    );

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            props.setPoints(event.target.value);
        }
    }
}

const Container = styled('div')({ display: 'flex', alignItems: 'baseline' });

const StyledTextField = styled(TextField)({
    maxWidth: 60,
});

const SlashText = styled(Typography)(({ theme }) => ({ marginRight: theme.spacing() }));

export { PointsEditing };
