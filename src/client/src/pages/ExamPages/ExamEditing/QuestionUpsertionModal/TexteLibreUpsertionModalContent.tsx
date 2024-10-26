import { TextField } from '@mui/material';
import { QuestionInputContainer } from './QuestionInputContainer';
import { PointsTextField } from '../components/PointsTextField';

function TexteLibreUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    points: string;
    setPoints: (points: string) => void;
    canEditPoints: boolean;
}) {
    return (
        <>
            <QuestionInputContainer title="Question à laquelle doit répondre l'élève">
                <TextField
                    multiline
                    autoFocus
                    fullWidth
                    label="Intitulé"
                    value={props.title}
                    onChange={(event) => props.setTitle(event.target.value)}
                    placeholder="Serions-nous plus libres sans l'État ?"
                />
            </QuestionInputContainer>
            <QuestionInputContainer isLastItem title="Nombre de points attribués à la question">
                <PointsTextField
                    canEdit={props.canEditPoints}
                    points={props.points}
                    setPoints={props.setPoints}
                />
            </QuestionInputContainer>
        </>
    );
}

export { TexteLibreUpsertionModalContent };
