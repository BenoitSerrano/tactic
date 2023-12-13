import { TextField, styled } from '@mui/material';
import { FLOATING_NUMBER_REGEX } from '../../constants';

function TexteLibreUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    points: number;
    setPoints: (points: number) => void;
}) {
    return (
        <>
            <RowContainer>
                <TextField
                    fullWidth
                    label="Intitulé de la question"
                    value={props.title}
                    onChange={(event) => props.setTitle(event.target.value)}
                    placeholder="Serions-nous plus libres sans l'État ?"
                />
            </RowContainer>
            <RowContainer>
                <TextField
                    value={props.points}
                    onChange={onChangePoint}
                    label="Point(s) pour la question"
                />
            </RowContainer>
        </>
    );

    function onChangePoint(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            props.setPoints(Number(value));
        }
    }
}

const RowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flex: 1,
    width: '100%',
}));

export { TexteLibreUpsertionModalContent };
