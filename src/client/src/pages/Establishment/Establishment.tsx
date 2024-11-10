import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    Menu as MuiMenu,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    styled,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { Loader } from '../../components/Loader';
import { ClasseCreationModal } from './ClasseCreationModal';
import { Menu } from '../../components/Menu';
import { IconButton } from '../../components/IconButton';
import { pathHandler } from '../../lib/pathHandler';
import { AdminSideMenu } from '../../components/AdminSideMenu';
import { EditableName } from './EditableName';

function Establishment() {
    const params = useParams();
    const establishmentId = params.establishmentId as string;
    const establishmentsQuery = useQuery({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
    });
    const [currentOptionMenu, setCurrentOptionMenu] = useState<
        | {
              element: HTMLElement;
              classeId: string;
          }
        | undefined
    >(undefined);

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
    const buttons = [
        {
            IconComponent: AddCircleOutlineIcon,
            onClick: openClasseCreationModal,
            title: 'Créer une classe',
        },
    ];

    return (
        <>
            <MuiMenu
                anchorEl={currentOptionMenu?.element}
                open={!!currentOptionMenu}
                onClose={closeCurrentOptionMenu}
            >
                <ImportantMenuItem onClick={buildDeleteClasse(currentOptionMenu?.classeId)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </ImportantMenuItem>
            </MuiMenu>

            <ClasseCreationModal
                isOpen={isClasseCreationModalOpen}
                close={closeClasseCreationModal}
            />
            <Menu buttons={buttons} />
            <ContentContainer>
                <AdminSideMenu establishments={establishments} />
                <TableContainer>
                    <EditableName establishment={establishment} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={100}>Actions</TableCell>
                                <TableCell>Nom</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {establishment.classes.map((classe) => (
                                <ClickableTableRow
                                    hover
                                    key={classe.id}
                                    onClick={handleRowClick(classe.id)}
                                >
                                    <TableCell>
                                        <IconButton
                                            title="Actions"
                                            IconComponent={MoreHorizIcon}
                                            onClick={buildOpenOptionMenu(classe.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{classe.name}</TableCell>
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ContentContainer>
        </>
    );

    function handleRowClick(classeId: string) {
        return () => {
            navigate(pathHandler.getRoutePath('STUDENTS', { classeId, establishmentId }));
        };
    }

    function buildOpenOptionMenu(classeId: string) {
        return (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();

            setCurrentOptionMenu({ element: event.currentTarget, classeId });
        };
    }

    function closeCurrentOptionMenu() {
        setCurrentOptionMenu(undefined);
    }

    function openClasseCreationModal() {
        setIsClasseCreationModalOpen(true);
    }

    function closeClasseCreationModal() {
        setIsClasseCreationModalOpen(false);
    }

    function buildDeleteClasse(classeId: string | undefined) {
        return () => {
            if (!classeId) {
                return;
            }
            closeCurrentOptionMenu();

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
const ClickableTableRow = styled(TableRow)({ cursor: 'pointer' });
const ImportantMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.error.main,
    '.MuiListItemIcon-root': { color: theme.palette.error.main },
}));

export { Establishment };
