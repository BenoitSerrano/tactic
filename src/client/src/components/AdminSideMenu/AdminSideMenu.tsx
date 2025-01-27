import { styled } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { ClasseSideItemMenu, EstablishmentSideItemMenu } from './SideItemMenu';
import { Button } from '../Button';
import { EstablishmentCreationModal } from './EstablishmentCreationModal';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { establishmentWithClassesType } from '../../lib/api/establishmentsApi';
import { IconButton } from '../IconButton';
import { EstablishmentListEditionModal } from './EstablishmentListEditionModal';

function AdminSideMenu(props: { establishments: Array<establishmentWithClassesType> }) {
    const { establishmentId, classeId } = useParams();
    const [isEstablishmentCreationModalOpen, setIsEstablishmentCreationModalOpen] = useState(false);
    const [isEstablishmentListEditionModalOpen, setIsEstablishmentListEditionModalOpen] =
        useState(false);
    return (
        <Container>
            <EstablishmentCreationModal
                close={closeEstablishmentCreationModal}
                isOpen={isEstablishmentCreationModalOpen}
            />
            <EstablishmentListEditionModal
                close={closeEstablishmentListEditionModal}
                isOpen={isEstablishmentListEditionModalOpen}
                establishments={props.establishments}
            />
            {props.establishments.map((establishment) => (
                <SideItemContainer key={establishment.id}>
                    <EstablishmentSideItemMenu
                        isActive={establishment.id === establishmentId}
                        establishment={establishment}
                    />
                    {establishment.classes.map((classe) => (
                        <SideItemContainer>
                            <ClasseSideItemMenu
                                isActive={classe.id === classeId}
                                establishmentId={establishment.id}
                                classe={classe}
                            />
                        </SideItemContainer>
                    ))}
                </SideItemContainer>
            ))}
            <ButtonContainer>
                <Button
                    onClick={openEstablishmentCreationModal}
                    variant="outlined"
                    fullWidth
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                >
                    Ajouter un établissement
                </Button>
                <IconButton
                    color="default"
                    title="Éditer la liste des établissements"
                    IconComponent={EditIcon}
                    onClick={openEstablishmentListEditionModal}
                />
            </ButtonContainer>
        </Container>
    );

    function openEstablishmentCreationModal() {
        setIsEstablishmentCreationModalOpen(true);
    }
    function closeEstablishmentCreationModal() {
        setIsEstablishmentCreationModalOpen(false);
    }
    function openEstablishmentListEditionModal() {
        setIsEstablishmentListEditionModalOpen(true);
    }
    function closeEstablishmentListEditionModal() {
        setIsEstablishmentListEditionModalOpen(false);
    }
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '25%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexDirection: 'column',
}));

const SideItemContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
}));
const ButtonContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
}));

export { AdminSideMenu };
