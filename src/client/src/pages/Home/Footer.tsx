import { Typography, styled } from '@mui/material';

function Footer() {
    return (
        <Container>
            <InnerContainer>
                <img src="./full_logo.png" alt="Logo Tactic" height="35" />
                <Typography>Copyright © 2023 Tactic SAS</Typography>
            </InnerContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    paddingTop: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTop: `${theme.palette.divider} 1px solid`,
}));

const InnerContainer = styled('div')();

export { Footer };
