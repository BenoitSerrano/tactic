import { Slide, styled, TextField, Typography } from '@mui/material';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CheckIcon from '@mui/icons-material/Check';

import { IconButton } from '../../components/IconButton';
import { classeType, establishmentType } from './types';

function ClasseSlide(props: {
    currentEstablishment: establishmentType | undefined;
    finishOnboarding: (
        establishmentId: establishmentType['id'],
        classeId: classeType['id'],
    ) => void;
}) {
    const [name, setName] = useState('');
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const createClasseMutation = useMutation({
        mutationFn: api.createClasse,
        onSuccess: (classe) => {
            if (!props.currentEstablishment) {
                return;
            }
            setName('');
            queryClient.invalidateQueries({ queryKey: ['establishments'] });
            props.finishOnboarding(props.currentEstablishment.id, classe.id);
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
        <Slide direction="up" in={!!props.currentEstablishment}>
            <ContentContainer>
                <Title variant="h2">
                    {props.currentEstablishment
                        ? props.currentEstablishment.name
                        : 'Mon établissement principal'}
                </Title>
                <Subtitle variant="h3">Ma classe principale</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Nom de la classe"
                        value={name}
                        onChange={onChange}
                    />
                    <IconButton
                        size="large"
                        type="submit"
                        title="Valider"
                        IconComponent={CheckIcon}
                    />
                </Form>
            </ContentContainer>
        </Slide>
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createClasse();
    }

    function createClasse() {
        if (!props.currentEstablishment) {
            return;
        }
        createClasseMutation.mutate({ name, establishmentId: props.currentEstablishment.id });
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }
}
const ContentContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));
const Form = styled('form')(({ theme }) => ({ display: 'flex' }));
const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(1) }));
const Subtitle = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(5) }));
export { ClasseSlide };
