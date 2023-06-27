import React, { useState } from 'react';
import { Button, TextField, Typography, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

function ExamDone() {
    const [comment, setComment] = useState('');
    const params = useParams();
    const studentId = params.studentId as string;
    return (
        <MainContainer>
            <Header>
                <Typography variant="h5">Merci d'avoir répondu au test.</Typography>
                <Typography variant="body1">
                    <em>Thank you for completing the test.</em>
                </Typography>
            </Header>
            <TopContainer>
                <LeftContainer>
                    <Typography>
                        S'il y a des informations sur vous que vous souhaitez nous faire connaître,
                        ou si vous avez des besoins spécifiques (par exemple dyslexie, troubles de
                        l'attention, autisme...), vous pouvez les indiquer ci-dessous ou écrire à
                        Hélène Boisson (helene.boisson@ens.psl.eu)
                    </Typography>
                </LeftContainer>
                <RightContainer>
                    <Typography>
                        If there is any information you would like to share with us or if you have
                        specific needs (for instance dyslexia, ADHD, autism...), you can let us know
                        here or write an email to Hélène Boisson (helene.boisson@ens.psl.eu)
                    </Typography>
                </RightContainer>
            </TopContainer>

            <BottomContainer>
                <TextField
                    label="Commentaires"
                    fullWidth
                    multiline
                    rows={4}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />
                <Button disabled={!comment} variant="contained" onClick={sendComment}>
                    Envoyer
                </Button>
            </BottomContainer>
        </MainContainer>
    );

    async function sendComment() {
        await api.patchComment(studentId, comment);
        alert('Your comment has been sent. You can now close this tab.');
    }
}

const MainContainer = styled('div')({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'justify',
});
const LeftContainer = styled('div')({ padding: '20px', flex: 1 });
const RightContainer = styled('div')({ fontStyle: 'italic', padding: '20px', flex: 1 });
const BottomContainer = styled('div')({
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
});
const TopContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
});
const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '100px',
});

export { ExamDone };
