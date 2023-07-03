import React, { useState } from 'react';
import { Button, TextField, Typography, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Page } from '../components/Page';

function ExamDone() {
    const [comment, setComment] = useState('');
    const params = useParams();
    const studentId = params.studentId as string;
    return (
        <Page>
            <MainContainer>
                <Header>
                    <p>
                        <Typography variant="h5">
                            Merci d'avoir répondu au test, vos réponses ont été enregistrées. Vous
                            recevrez un message avant le stage de septembre pour vous indiquer dans
                            quel groupe vous serez.
                        </Typography>
                    </p>
                    <p>
                        <Typography variant="body1">
                            <em>
                                Thank you for completing the test, your answers have been saved. You
                                will get an e-mail prior to the intensive in September to let you
                                know which group you will be part of.
                            </em>
                        </Typography>
                    </p>
                </Header>
                <TopContainer>
                    <LeftContainer>
                        <Typography>
                            S'il y a des informations sur vous que vous souhaitez nous faire
                            connaître, ou si vous avez des besoins spécifiques (par exemple
                            dyslexie, troubles de l'attention, autisme...), vous pouvez les indiquer
                            ci-dessous ou écrire à
                            Hélène&nbsp;Boisson&nbsp;(helene.boisson@ens.psl.eu)
                        </Typography>
                    </LeftContainer>
                    <RightContainer>
                        <Typography>
                            If there is any information you would like to share with us or if you
                            have specific needs (for instance dyslexia, ADHD, autism...), you can
                            let us know here or write an email to
                            Hélène&nbsp;Boisson&nbsp;(helene.boisson@ens.psl.eu)
                        </Typography>
                    </RightContainer>
                </TopContainer>

                <BottomContainer>
                    <TextField
                        label="Commentaires"
                        placeholder="..."
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
        </Page>
    );

    async function sendComment() {
        await api.patchComment(studentId, comment);
        alert('Your comment has been sent. You can now close this tab.');
    }
}

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '50%',
});
const LeftContainer = styled('div')({ padding: '20px', flex: 1 });
const RightContainer = styled('div')({ fontStyle: 'italic', padding: '20px', flex: 1 });
const BottomContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
});
const TopContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
});
const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '20px',
});

export { ExamDone };
