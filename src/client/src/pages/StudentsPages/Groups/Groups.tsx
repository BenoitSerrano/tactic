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
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../../lib/pathHandler';
import { GroupCreationModal } from './GroupCreationModal';
import { useState } from 'react';
import { Menu } from '../../../components/Menu';
import { groupApiType } from '../types';
import { useAlert } from '../../../lib/alert';
import { AdminSideMenu } from '../../../components/AdminSideMenu';

function Groups() {
    const query = useQuery<groupApiType[]>({
        queryKey: ['groups'],
        queryFn: api.fetchGroups,
    });
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const [isGroupCreationModalOpen, setIsGroupCreationModalOpen] = useState(false);
    const deleteGroupMutation = useMutation({
        mutationFn: api.deleteGroup,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'Le groupe a été supprimé.' });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Le groupe n'a pas pu être supprimé.",
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

    const groups = query.data;
    const buttons = [
        {
            IconComponent: AddCircleOutlineIcon,
            onClick: openGroupCreationModal,
            title: 'Créer un groupe',
        },
    ];

    return (
        <>
            <GroupCreationModal isOpen={isGroupCreationModalOpen} close={closeGroupCreationModal} />
            <Menu buttons={buttons} />
            <ContentContainer>
                <AdminSideMenu />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={100}>Actions</TableCell>
                            <TableCell>Nom</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups.map((group) => (
                            <TableRow key={group.id}>
                                <TableCell>
                                    <Tooltip title="Accéder à la liste des étudiants">
                                        <IconButton onClick={buildNavigateToStudents(group.id)}>
                                            <FormatListBulletedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Supprimer le groupe">
                                        <IconButton onClick={buildDeleteGroup(group.id)}>
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{group.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ContentContainer>
        </>
    );

    function openGroupCreationModal() {
        setIsGroupCreationModalOpen(true);
    }

    function closeGroupCreationModal() {
        setIsGroupCreationModalOpen(false);
    }

    function buildNavigateToStudents(groupId: string) {
        return () => {
            navigate(pathHandler.getRoutePath('STUDENTS', { groupId }));
        };
    }

    function buildDeleteGroup(groupId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer ce groupe ? Les étudiants et leurs résultats aux examens seront supprimés.',
            );
            if (hasConfirmed) {
                deleteGroupMutation.mutate({ groupId });
            }
        };
    }
}

const ContentContainer = styled('div')({ display: 'flex' });

export { Groups };
