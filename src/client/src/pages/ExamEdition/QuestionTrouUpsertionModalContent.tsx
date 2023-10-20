import { TextField, styled } from '@mui/material';

function QuestionTrouUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    rightAnswers: string[];
    setRightAnswers: (rightAnswers: string[]) => void;
    acceptableAnswers: string[];
    setAcceptableAnswers: (acceptableAnswers: string[]) => void;
}) {
    // TODO: ajouter précision sur le fait que qu'il faut mettre ...., ajouter erreur
    return (
        <>
            <RowContainer>
                <TextField
                    fullWidth
                    label="Intitulé de la question"
                    value={props.title}
                    onChange={(event) => props.setTitle(event.target.value)}
                    placeholder="..."
                />
            </RowContainer>
            <RowContainer>
                <TextField
                    fullWidth
                    label="Bonnes réponses"
                    placeholder="Ecrivez les bonnes réponses, séparées par des virgules"
                    value={props.rightAnswers.join(',')}
                    onChange={(event) => props.setRightAnswers(event.target.value.split(','))}
                />
            </RowContainer>
            <RowContainer>
                <TextField
                    fullWidth
                    label="Réponses acceptables"
                    placeholder="Ecrivez les réponses acceptables, séparées par des virgules"
                    value={props.acceptableAnswers.join(',')}
                    onChange={(event) => props.setAcceptableAnswers(event.target.value.split(','))}
                />
            </RowContainer>
        </>
    );
}

const RowContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    flex: 1,
    width: '100%',
});

export { QuestionTrouUpsertionModalContent };
