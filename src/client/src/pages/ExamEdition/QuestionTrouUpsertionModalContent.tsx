import { TextField, Typography, styled } from '@mui/material';

function QuestionTrouUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    rightAnswers: string[];
    setRightAnswers: (rightAnswers: string[]) => void;
    acceptableAnswers: string[];
    setAcceptableAnswers: (acceptableAnswers: string[]) => void;
}) {
    return (
        <>
            <RowContainer>
                <TextField
                    fullWidth
                    label="Intitulé de la question"
                    value={props.title}
                    onChange={(event) => props.setTitle(event.target.value)}
                    placeholder="Je suis, tu es, ...., nous sommes, vous êtes, ils sont"
                />
                <HintContainer>
                    <Typography variant="h6">
                        Les 4 points (....) correspondent au texte à remplacer par l'élève.
                    </Typography>
                </HintContainer>
            </RowContainer>
            <RowContainer>
                <TextField
                    fullWidth
                    label="Bonnes réponses"
                    placeholder="il est, elle est, on est"
                    value={props.rightAnswers.join(',')}
                    onChange={(event) => props.setRightAnswers(event.target.value.split(','))}
                />
                <HintContainer>
                    <Typography variant="h6">
                        Indiquez les bonnes réponses, séparées par des virgules
                    </Typography>
                </HintContainer>
            </RowContainer>
            <RowContainer>
                <TextField
                    fullWidth
                    label="Réponses acceptables"
                    value={props.acceptableAnswers.join(',')}
                    onChange={(event) => props.setAcceptableAnswers(event.target.value.split(','))}
                />
                <HintContainer>
                    <Typography variant="h6">
                        Indiquez les réponses acceptables, séparées par des virgules
                    </Typography>
                </HintContainer>
            </RowContainer>
        </>
    );
}

const RowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flex: 1,
    width: '100%',
}));

const HintContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(2) }));

export { QuestionTrouUpsertionModalContent };
