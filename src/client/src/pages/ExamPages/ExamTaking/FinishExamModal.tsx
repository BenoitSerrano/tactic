import { styled, Typography } from '@mui/material';
import { Modal } from '../../../components/Modal';

function FinishExamModal(props: {
    progresses: number[];
    close: () => void;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    isConfirmLoading: boolean;
}) {
    const untouchedExercises = props.progresses.reduce((acc, progress, index) => {
        return progress === 0 ? [...acc, index] : acc;
    }, [] as number[]);
    return (
        <Modal
            size="small"
            isOpen={props.isOpen}
            close={props.close}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            isConfirmLoading={props.isConfirmLoading}
            title="Terminer l'examen ?"
        >
            <ContentContainer>
                <Typography>
                    Souhaitez-vous valider vos réponses et mettre fin à l'examen ?
                </Typography>
                <Typography>
                    Vous ne pourrez plus revenir en arrière et modifier vos réponses.
                </Typography>
                {untouchedExercises.length > 0 && (
                    <UntouchedExercisesWarning>
                        <Typography>
                            Notez bien qu'aucune réponse n'a été remplie pour les exercices suivants
                            :
                            <ul>
                                {untouchedExercises.map((index) => (
                                    <li key={index}>Exercice {index + 1}</li>
                                ))}
                            </ul>
                        </Typography>
                    </UntouchedExercisesWarning>
                )}
            </ContentContainer>
        </Modal>
    );
}

const ContentContainer = styled('div')(({ theme }) => ({}));
const UntouchedExercisesWarning = styled('div')(({ theme }) => ({}));

export { FinishExamModal };
