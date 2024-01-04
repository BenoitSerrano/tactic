import { TextField, Typography, styled } from '@mui/material';
import { formErrorHandler } from '../lib/formErrorHandler';
import { FormHelperText } from '../../../../components/FormHelperText';

function QuestionReponseEditing(props: {
    index: number;
    formErrors: string[];
    shouldDisplayErrors: boolean;
    title: string;
    setTitle: (title: string) => void;
}) {
    const titleFormErrorMessage = formErrorHandler.extractTitleFormErrorMessage(props.formErrors);
    return (
        <Container>
            <TitleContainer>
                <TextField
                    error={props.shouldDisplayErrors && titleFormErrorMessage !== undefined}
                    helperText={
                        props.shouldDisplayErrors && (
                            <FormHelperText label={titleFormErrorMessage} />
                        )
                    }
                    fullWidth
                    label="Intitulé"
                    placeholder="Intitulé de la question"
                    value={props.title}
                    variant="standard"
                    onChange={(event) => props.setTitle(event.target.value)}
                />
            </TitleContainer>
        </Container>
    );
}

const Container = styled('div')({ width: '100%' });
const TitleContainer = styled('div')({
    display: 'flex',
    alignItems: 'baseline',
});
const AcceptableAnswersContainer = styled('div')({ display: 'flex' });

export { QuestionReponseEditing };
