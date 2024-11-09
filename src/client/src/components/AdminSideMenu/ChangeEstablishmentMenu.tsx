import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { styled, Typography } from '@mui/material';
import { useState } from 'react';
import { ChangeEstablishmentModal } from './ChangeEstablishmentModal';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { UpsertEstablishmentModal } from './UpsertEstablishmentModal';
import { establishmentUpsertionModalStatusType } from './types';

type modalCoordinatesType = { x: number; y: number };

function ChangeEstablishmentMenu(props: { currentEstablishmentId: string }) {
    const [modalChangeEstablishmentCoordinates, setChangeEstablishmentModalCoordinates] = useState<
        modalCoordinatesType | undefined
    >(undefined);
    const [establishmentUpsertionModalStatus, setEstablishmentUpsertionModalStatus] = useState<
        establishmentUpsertionModalStatusType | undefined
    >(undefined);

    const query = useQuery({ queryKey: ['establishments'], queryFn: api.fetchEstablishments });
    const currentEstablishment = query.data
        ? query.data.find((establishment) => props.currentEstablishmentId === establishment.id)
              ?.name
        : undefined;
    return (
        <Container>
            {!!establishmentUpsertionModalStatus && (
                <UpsertEstablishmentModal
                    close={closeUpsertEstablishmentModal}
                    modalStatus={establishmentUpsertionModalStatus}
                />
            )}
            <ChangeEstablishmentModal
                setEstablishmentUpsertionModalStatus={setEstablishmentUpsertionModalStatus}
                establishments={query.data}
                currentEstablishmentId={props.currentEstablishmentId}
                coordinates={modalChangeEstablishmentCoordinates}
                close={closeChangeEstablishmentModal}
            />
            <ButtonContainer onClick={openChangeEstablishmentModal}>
                <IconContainer>
                    <ChangeCircleOutlinedIcon />
                </IconContainer>
                <Typography>{currentEstablishment}</Typography>
            </ButtonContainer>
        </Container>
    );

    function closeUpsertEstablishmentModal() {
        setEstablishmentUpsertionModalStatus(undefined);
    }

    function openChangeEstablishmentModal(event: React.MouseEvent<HTMLDivElement>) {
        setChangeEstablishmentModalCoordinates({ x: 0, y: event.clientY });
    }

    function closeChangeEstablishmentModal() {
        setChangeEstablishmentModalCoordinates(undefined);
    }
}

export { ChangeEstablishmentMenu };

const Container = styled('div')(({ theme }) => ({}));
const ButtonContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    cursor: 'pointer',
    width: '100%',
    alignItems: 'center',
}));
const IconContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
}));
