import { Slide, styled, TextField, Typography } from '@mui/material';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CheckIcon from '@mui/icons-material/Check';

import { IconButton } from '../../components/IconButton';
import { establishmentType } from './types';

function EstablishmentSlide(props: {
    isDisplayed: boolean;
    goToNextSlide: (establishment: establishmentType) => void;
}) {
    const [name, setName] = useState('');
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const createEstablishmentMutation = useMutation({
        mutationFn: api.createEstablishment,
        onSuccess: (establishment) => {
            setName('');
            queryClient.invalidateQueries({ queryKey: ['establishments'] });
            props.goToNextSlide(establishment);
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'établissement n'a pas pu être créé.",
            });
        },
    });
    return (
        <Slide direction="up" in={props.isDisplayed}>
            <ContentContainer>
                <Title variant="h2">Mon établissement principal</Title>
                <Form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Nom de l'établissement"
                        value={name}
                        onChange={onChange}
                    />
                    <IconButton
                        size="large"
                        type="submit"
                        title="Valider"
                        isLoading={createEstablishmentMutation.isPending}
                        IconComponent={CheckIcon}
                    />
                </Form>
            </ContentContainer>
        </Slide>
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createEstablishment();
    }

    function createEstablishment() {
        createEstablishmentMutation.mutate({ name });
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }
}
const ContentContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));
const Form = styled('form')(({ theme }) => ({ display: 'flex' }));
const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(5) }));
export { EstablishmentSlide };
