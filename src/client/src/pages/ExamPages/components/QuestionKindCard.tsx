import { Card, Typography, styled } from '@mui/material';

function QuestionKindCard(props: {
    isSelected: boolean;
    onSelect: () => void;
    title: string;
    subtitle: string;
}) {
    const CardComponent = props.isSelected ? SelectedCardComponent : NotSelectedCardComponent;
    return (
        <Container>
            <CardComponent elevation={2} onClick={props.onSelect}>
                <Typography variant="h4">{props.title}</Typography>
                <Typography variant="h6">{props.subtitle}</Typography>
            </CardComponent>
        </Container>
    );
}

const SelectedCardComponent = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
    flex: 1,
    cursor: 'pointer',
}));

const NotSelectedCardComponent = styled(Card)(({ theme }) => ({
    padding: theme.spacing(1),
    cursor: 'pointer',
}));

const Container = styled('div')({ height: '100%', display: 'flex' });

export { QuestionKindCard };
