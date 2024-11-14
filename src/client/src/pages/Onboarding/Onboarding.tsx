import { styled, Typography } from '@mui/material';
import { useState } from 'react';
import { EstablishmentSlide } from './EstablishmentSlide';
import { classeType, establishmentType } from './types';
import { ClasseSlide } from './ClasseSlide';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';

function Onboarding() {
    const navigate = useNavigate();
    const [currentEstablishment, setCurrentEstablishment] = useState<
        establishmentType | undefined
    >();
    return (
        <Container>
            <Title variant="h1">Bienvenue sur Tactic!</Title>
            {!currentEstablishment && (
                <EstablishmentSlide
                    goToNextSlide={goToClasseSlide}
                    isDisplayed={!currentEstablishment}
                />
            )}
            {!!currentEstablishment && (
                <ClasseSlide
                    currentEstablishment={currentEstablishment}
                    finishOnboarding={goToClassePage}
                />
            )}
        </Container>
    );

    function goToClasseSlide(establishment: establishmentType) {
        setCurrentEstablishment(establishment);
    }

    function goToClassePage(establishmentId: establishmentType['id'], classeId: classeType['id']) {
        navigate(pathHandler.getRoutePath('CLASSE', { establishmentId, classeId }));
    }
}

export { Onboarding };

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
}));

const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(3) }));
