import { Typography, styled } from '@mui/material';

function ShuffleWord(props: { word: string; onClick?: () => void }) {
    const Container = props.onClick ? ClickableContainer : NonClickableContainer;
    return <Container>{props.word}</Container>;
}

const ClickableContainer = styled(Typography)({
    borderWidth: '2px',
    borderStyle: 'dotted',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
    cursor: 'pointer',
});

const NonClickableContainer = styled(Typography)({
    borderWidth: '2px',
    borderStyle: 'dotted',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
});

export { ShuffleWord };
