import { Card, Typography, styled } from '@mui/material';

function QuestionKindCard(props: {
    isSelected: boolean;
    onSelect: () => void;
    title: string;
    subtitle: string;
}) {
    const CardComponent = props.isSelected ? SelectedCardComponent : NotSelectedCardComponent;
    return (
        <CardComponent onClick={selectQuestionKind}>
            <Typography variant="h5">{props.title}</Typography>
            <Typography variant="h6">{props.subtitle}</Typography>
        </CardComponent>
    );

    function selectQuestionKind() {
        if (!props.isSelected) {
            props.onSelect();
        }
    }
}

const SelectedCardComponent = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
}));

const NotSelectedCardComponent = styled(Card)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    cursor: 'pointer',
}));

export { QuestionKindCard };
