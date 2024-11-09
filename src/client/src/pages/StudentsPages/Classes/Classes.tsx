import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoveDownIcon from '@mui/icons-material/MoveDown';
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
import { IconButton } from '../../../components/IconButton';
import { ChangeEstablishmentForClasseModal } from './ChangeEstablishmentForClasseModal';

function Classes() {
    const params = useParams();
    const establishmentId = params.establishmentId as string;
    const query = useQuery<classeApiType[]>({
        queryKey: ['establishment', establishmentId, 'classes'],
        queryFn: () => api.fetchClassesByEstablishment(establishmentId),
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
    const [currentClasseIdToChange, setCurrentClasseIdToChange] = useState<string | undefined>(
        undefined,
    );

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
            <MuiMenu
                anchorEl={currentOptionMenu?.element}
                open={!!currentOptionMenu}
                onClose={closeCurrentOptionMenu}
            >
                <MenuItem onClick={buildChangeEstablishment(currentOptionMenu?.classeId)}>
                    <ListItemIcon>
                        <MoveDownIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Changer d'établissement</ListItemText>
                </MenuItem>
                <ImportantMenuItem onClick={buildDeleteClasse(currentOptionMenu?.classeId)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </ImportantMenuItem>
            </MuiMenu>
            <ChangeEstablishmentForClasseModal
                classeId={currentClasseIdToChange}
                close={closeChangeEstablishmentModal}
                currentEstablishmentId={establishmentId}
            />
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

    function closeChangeEstablishmentModal() {
        setCurrentClasseIdToChange(undefined);
    }

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

    function buildChangeEstablishment(classeId: string | undefined) {
        return () => {
            if (!classeId) {
                return;
            }
            closeCurrentOptionMenu();
            setCurrentClasseIdToChange(classeId);
        };
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

export { Classes };
