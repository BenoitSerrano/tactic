import { Accordion, AccordionDetails, AccordionSummary, styled, Typography } from '@mui/material';
import { FAQ_CONTENT } from './constants';

function FAQ() {
    return (
        <Container>
            <Title variant="h1">Foire Aux Questions</Title>

            {FAQ_CONTENT.map(({ question, answer }, index) => (
                <AccordionContainer>
                    <Accordion key={`faq-${index}`} disableGutters>
                        <AccordionSummary>
                            <Typography variant="h4">{question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                </AccordionContainer>
            ))}
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    padding: theme.spacing(5),
}));
const Title = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));
const AccordionContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

export { FAQ };
