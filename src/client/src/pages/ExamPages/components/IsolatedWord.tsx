import { Typography, styled } from '@mui/material';

function IsolatedWord(props: { word: string; onClick?: () => void }) {
    const Container = props.onClick ? ClickableContainer : NonClickableContainer;
    return <Container onClick={props.onClick}>{props.word}</Container>;
}

const ClickableContainer = styled(Typography)({
    borderWidth: '1px',
    borderStyle: 'dashed',
    padding: '4px',
    borderRadius: '4px',
    cursor: 'pointer',
});

const NonClickableContainer = styled(Typography)({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '4px',
    padding: '4px',
});

const IsolatedWordContainer = styled('div')({
    marginLeft: '4px',
    marginRight: '4px',
});

export { IsolatedWord, IsolatedWordContainer };
