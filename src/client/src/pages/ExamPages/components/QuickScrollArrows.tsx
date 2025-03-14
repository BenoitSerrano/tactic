import { styled } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IconButton } from '../../../components/IconButton';
import { useLocation } from 'react-router-dom';

const CRISP_RIGHT_OFFSET = 34;
const CRISP_BOTTOM_OFFSET = 88;

function QuickScrollArrows() {
    const location = useLocation();
    const isTeacherPage = location.pathname.startsWith('/teacher/');
    const isCrispIconDisplayed = isTeacherPage;
    return (
        <Container isCrispIconDisplayed={isCrispIconDisplayed}>
            <IconContainer>
                <IconButton
                    title="Aller en haut"
                    placement="left"
                    onClick={scrollToTop}
                    IconComponent={ArrowUpwardIcon}
                />
            </IconContainer>
            <IconContainer>
                <IconButton
                    placement="left"
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

const Container = styled('div')<{ isCrispIconDisplayed: boolean }>(
    ({ theme, isCrispIconDisplayed }) => ({
        [theme.breakpoints.down('md')]: {
            right: 0,
            bottom: isCrispIconDisplayed ? CRISP_BOTTOM_OFFSET : 0,
        },
        [theme.breakpoints.up('md')]: {
            bottom: isCrispIconDisplayed ? CRISP_BOTTOM_OFFSET : theme.spacing(1), // to fit in the middle of the crisp icon,
            right: isCrispIconDisplayed ? CRISP_RIGHT_OFFSET : theme.spacing(1), // to fit in the middle of the crisp icon
        },
        position: 'fixed',
    }),
);
const IconContainer = styled('div')({});
