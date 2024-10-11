import { styled } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IconButton } from '../../../components/IconButton';

function QuickScrollArrows() {
    return (
        <Container>
            <IconContainer>
                <IconButton
                    title="Aller en haut"
                    placement="top"
                    onClick={scrollToTop}
                    IconComponent={ArrowUpwardIcon}
                />
            </IconContainer>
            <IconContainer>
                <IconButton
                    placement="bottom"
                    title="Aller en bas"
                    onClick={scrollToBottom}
                    IconComponent={ArrowDownwardIcon}
                />
            </IconContainer>
        </Container>
    );

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function scrollToBottom() {
        window.scrollTo({ top: document.body.clientHeight, behavior: 'smooth' });
    }
}

export { QuickScrollArrows };

const Container = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        left: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
        left: '8vw',
    },
    position: 'fixed',
    bottom: theme.spacing(6),
}));
const IconContainer = styled('div')({});
