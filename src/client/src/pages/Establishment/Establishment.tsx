import { useQuery } from '@tanstack/react-query';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Loader } from '../../components/Loader';
import { ClasseCreationModal } from './ClasseCreationModal';
import { AdminSideMenu } from '../../components/AdminSideMenu';
import { EditableName } from './EditableName';
import { ClasseRow } from './ClasseRow';
import { Button } from '../../components/Button';
import { establishmentsApi } from '../../lib/api/establishmentsApi';

function Establishment() {
    const params = useParams();
    const establishmentId = params.establishmentId as string;
    const establishmentsQuery = useQuery({
        queryKey: ['establishments', 'with-classes'],
        queryFn: establishmentsApi.getEstablishmentsWithClasses,
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
                            Ajouter une classe
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
const TableContainer = styled('div')({ width: '65%' });

export { Establishment };
