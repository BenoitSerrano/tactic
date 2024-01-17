import { TextField } from '@mui/material';
import { QuestionInputContainer } from './QuestionInputContainer';

function TexteLibreUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    return (
        <>
            <QuestionInputContainer title="Question à laquelle doit répondre l'élève">
                <TextField
                    autoFocus
                    fullWidth
                    label="Intitulé"
                    value={props.title}
                    onChange={(event) => props.setTitle(event.target.value)}
                    placeholder="Serions-nous plus libres sans l'État ?"
                />
            </QuestionInputContainer>
            <QuestionInputContainer isLastItem title="Nombre de points attribués à la question">
                <TextField
                    value={props.points}
                    onChange={(event) => props.setPoints(event.target.value)}
                    label="Point(s)"
                />
            </QuestionInputContainer>
        </>
    );
}

export { TexteLibreUpsertionModalContent };
