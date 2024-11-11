import { useQuery } from '@tanstack/react-query';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { ClasseCreationModal } from './ClasseCreationModal';
import { AdminSideMenu } from '../../components/AdminSideMenu';
import { EditableName } from './EditableName';
import { ClasseRow } from './ClasseRow';
import { Button } from '../../components/Button';
import { useStoreCurrentLocation } from '../../lib/useStoreCurrentLocation';

function Establishment() {
    useStoreCurrentLocation();
    const params = useParams();
    const establishmentId = params.establishmentId as string;
    const establishmentsQuery = useQuery({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
    });

    const [isClasseCreationModalOpen, setIsClasseCreationModalOpen] = useState(false);

    if (!establishmentsQuery.data) {
        if (establishmentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const establishments = establishmentsQuery.data;
    const establishment = establishments.find(
        (establishment) => establishmentId === establishment.id,
    );
    if (!establishment) {
        return <div />;
    }

    return (
        <>
            <ClasseCreationModal
                establishmentId={establishmentId}
                isOpen={isClasseCreationModalOpen}
                close={closeClasseCreationModal}
            />
            <ContentContainer>
                <AdminSideMenu establishments={establishments} />
                <TableContainer>
                    <EditableName establishment={establishment} />
                    {establishment.classes.map((classe) => (
                        <ClasseRowContainer key={classe.id}>
                            <ClasseRow classe={classe} />
                        </ClasseRowContainer>
                    ))}
                    <ButtonContainer>
                        <Button
                            onClick={openClasseCreationModal}
                            fullWidth
                            startIcon={<AddCircleOutlineIcon />}
                            variant="contained"
                        >
                            Ajouter une classe{' '}
                        </Button>
                    </ButtonContainer>
                </TableContainer>
            </ContentContainer>
        </>
    );

    function openClasseCreationModal() {
        setIsClasseCreationModalOpen(true);
    }

    function closeClasseCreationModal() {
        setIsClasseCreationModalOpen(false);
    }
}

const ClasseRowContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
const ButtonContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
}));
const ContentContainer = styled('div')({ display: 'flex' });
const TableContainer = styled('div')({ width: '50%' });

export { Establishment };
