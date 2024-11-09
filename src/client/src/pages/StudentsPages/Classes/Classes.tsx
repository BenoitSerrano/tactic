import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    styled,
} from '@mui/material';
import { Loader } from '../../../components/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { pathHandler } from '../../../lib/pathHandler';
import { ClasseCreationModal } from './ClasseCreationModal';
import { useState } from 'react';
import { Menu } from '../../../components/Menu';
import { classeApiType } from '../types';
import { useAlert } from '../../../lib/alert';
import { AdminSideMenu } from '../../../components/AdminSideMenu';
import { PageTitle } from '../../../components/PageTitle';

function Classes() {
    const params = useParams();
    const establishmentId = params.establishmentId as string;
    const query = useQuery<classeApiType[]>({
        queryKey: ['classes'],
        queryFn: () => api.fetchClassesByEstablishment(establishmentId),
    });
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const [isClasseCreationModalOpen, setIsClasseCreationModalOpen] = useState(false);
    const deleteClasseMutation = useMutation({
        mutationFn: api.deleteClasse,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'La classe a été supprimé.' });
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. La classe n'a pas pu être supprimé.",
            });
        },
    });
    const navigate = useNavigate();

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const classes = query.data;
    const buttons = [
        {
            IconComponent: AddCircleOutlineIcon,
            onClick: openClasseCreationModal,
            title: 'Créer une classe',
        },
    ];

    return (
        <>
            <ClasseCreationModal
                isOpen={isClasseCreationModalOpen}
                close={closeClasseCreationModal}
            />
            <Menu buttons={buttons} />
            <ContentContainer>
                <AdminSideMenu currentEstablishmentId={establishmentId} />
                <TableContainer>
                    <PageTitle title="Mes classes" />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={100}>Actions</TableCell>
                                <TableCell>Nom</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classes.map((classe) => (
                                <TableRow key={classe.id}>
                                    <TableCell>
                                        <Tooltip title="Accéder à la liste des étudiants">
                                            <IconButton
                                                onClick={buildNavigateToStudents(classe.id)}
                                            >
                                                <FormatListBulletedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Supprimer la classe">
                                            <IconButton onClick={buildDeleteClasse(classe.id)}>
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{classe.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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

    function buildNavigateToStudents(classeId: string) {
        return () => {
            navigate(pathHandler.getRoutePath('STUDENTS', { classeId, establishmentId }));
        };
    }

    function buildDeleteClasse(classeId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cette classe ? Les étudiants et leurs résultats aux examens seront supprimés.',
            );
            if (hasConfirmed) {
                deleteClasseMutation.mutate({ classeId });
            }
        };
    }
}

const ContentContainer = styled('div')({ display: 'flex' });
const TableContainer = styled('div')({});

export { Classes };
