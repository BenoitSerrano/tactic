import { Link } from 'react-router-dom';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SchoolIcon from '@mui/icons-material/School';
import { Typography, styled } from '@mui/material';
import { pathHandler } from '../lib/pathHandler';

function TeacherHome() {
    return (
        <Container>
            <ItemContainer>
                <Link to={pathHandler.getRoutePath('GROUPS')}>
                    <LinkContent>
                        <Diversity3Icon fontSize="large" />
                        <Typography>Vos étudiants</Typography>
                    </LinkContent>
                </Link>
            </ItemContainer>
            <ItemContainer>
                <Link to={pathHandler.getRoutePath('EXAMS')}>
                    <LinkContent>
                        <SchoolIcon fontSize="large" />
                        <Typography>Vos examens</Typography>
                    </LinkContent>
                </Link>
            </ItemContainer>
        </Container>
    );
}

const Container = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
});

const ItemContainer = styled('div')({
    marginRight: '8px',
    marginLeft: '8px',
});

const LinkContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
});

export { TeacherHome };
