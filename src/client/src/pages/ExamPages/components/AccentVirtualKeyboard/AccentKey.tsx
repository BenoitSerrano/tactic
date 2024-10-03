import { styled } from '@mui/material';
import { Button } from '../../../../components/Button';

function AccentKey(props: { value: string; onAddCharacter: (character: string) => void }) {
    return (
        <Container>
            <Button
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                    event.preventDefault();
                    props.onAddCharacter(props.value);
                }}
            >
                {props.value}
            </Button>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({}));

export { AccentKey };
