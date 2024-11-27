import { Checkbox, FormControlLabel, TextField, Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../lib/alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { pathHandler } from '../lib/pathHandler';
import { LoadingButton } from '@mui/lab';
import { localSessionHandler } from '../lib/localSessionHandler';
import { usersApi } from '../lib/api/usersApi';
import { Link } from 'react-router-dom';

function SignUp(props: { title: string }) {
    const [searchParams] = useSearchParams();
    const queryParamsEmail = searchParams.get('email');
    const queryParamsPackageId = searchParams.get('packageId');
    const [email, setEmail] = useState(queryParamsEmail || '');
    const [password, setPassword] = useState('');
    const [establishmentName, setEstablishmentName] = useState('');
    const [classeName, setClasseName] = useState('');
    const [isCGVChecked, setIsCGVChecked] = useState(false);
    const navigate = useNavigate();

    const { displayAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: usersApi.createUser,
        onSuccess: (data) => {
            const { token, userInfo } = data;
            localSessionHandler.setToken(token);
            localSessionHandler.setUserInfo(userInfo);

            navigate(
                pathHandler.getRoutePath(
                    'TEACHER_HOME',
                    {},
                    { packageId: queryParamsPackageId || '' },
                ),
            );
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue.',
            });
        },
    });

    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card size="medium">
                    <CardContent onSubmit={handleSubmit}>
                        <TitleContainer>
                            <Typography variant="h2">{props.title}</Typography>
                        </TitleContainer>

                        <FieldsContainer>
                            <FieldContainer>
                                <TextField
                                    required
                                    autoFocus
                                    fullWidth
                                    name="email"
                                    type="email"
                                    label="Adresse e-mail"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Mot de passe"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <TextField
                                    required
                                    fullWidth
                                    name="establishment"
                                    type="text"
                                    label="Établissement principal"
                                    value={establishmentName}
                                    onChange={(event) => setEstablishmentName(event.target.value)}
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <TextField
                                    required
                                    fullWidth
                                    name="classe"
                                    type="text"
                                    label="Classe principale"
                                    value={classeName}
                                    onChange={(event) => setClasseName(event.target.value)}
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <FormControlLabel
                                    required
                                    control={
                                        <Checkbox checked={isCGVChecked} onChange={onChangeCGV} />
                                    }
                                    label={
                                        <Typography>
                                            J'ai lu et j'accepte les 
                                            <Link
                                                target="_blank"
                                                to={pathHandler.getRoutePath(
                                                    'TERMS_AND_CONDITIONS_OF_SALE',
                                                )}
                                            >
                                                Conditions Générales de Vente
                                            </Link>
                                        </Typography>
                                    }
                                />
                            </FieldContainer>
                        </FieldsContainer>

                        <LoadingButton
                            loading={mutation.isPending}
                            type="submit"
                            variant="contained"
                            disabled={
                                !password ||
                                !email ||
                                !establishmentName ||
                                !classeName ||
                                !isCGVChecked
                            }
                        >
                            {props.title}
                        </LoadingButton>
                    </CardContent>
                </Card>
            </ContentContainer>
        </NotLoggedInPage>
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        mutation.mutate({ email, password, establishmentName, classeName });
        event.preventDefault();
    }

    function onChangeCGV(_event: ChangeEvent<HTMLInputElement>, checked: boolean) {
        setIsCGVChecked(checked);
    }
}

const ContentContainer = styled('div')({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
});

const CardContent = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
}));

const FieldsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
}));
const FieldContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(2) }));
const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(6),
    textAlign: 'center',
}));

export { SignUp };
