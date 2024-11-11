import { styled } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { ClasseSideItemMenu, EstablishmentSideItemMenu, OverallSideItemMenu } from './SideItemMenu';
import { establishmentWithClassesType } from '../../lib/api/api';
import { Button } from '../Button';
import { EstablishmentCreationModal } from './EstablishmentCreationModal';
import { useState } from 'react';

function AdminSideMenu(props: { establishments: Array<establishmentWithClassesType> }) {
    const [isEstablishmentCreationModalOpen, setIsEstablishmentCreationModalOpen] = useState(false);
    return (
        <Container>
            <EstablishmentCreationModal
                close={closeEstablishmentCreationModal}
                isOpen={isEstablishmentCreationModalOpen}
            />
            <OverallSideItemMenu />
            {props.establishments.map((establishment) => (
                <SideItemContainer key={establishment.id}>
                    <EstablishmentSideItemMenu establishment={establishment} />
                    {establishment.classes.map((classe) => (
                        <SideItemContainer>
                            <ClasseSideItemMenu
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
            </ButtonContainer>
        </Container>
    );

    function openEstablishmentCreationModal() {
        setIsEstablishmentCreationModalOpen(true);
    }
    function closeEstablishmentCreationModal() {
        setIsEstablishmentCreationModalOpen(false);
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
const ButtonContainer = styled('div')(({ theme }) => ({ marginTop: theme.spacing(2) }));

export { AdminSideMenu };
