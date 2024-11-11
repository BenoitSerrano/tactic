import {
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { IconButton } from '../../IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ScannerIcon from '@mui/icons-material/Scanner';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { EditableName } from './EditableName';
import { EditableExamDuration } from '../../EditableExamDuration';
import { examApiType } from '../../../pages/Classe/types';
import { pathHandler } from '../../../lib/pathHandler';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';

function ExamTable(props: {
    establishmentId: string;
    classeId: string;
    exams: examApiType[];
    title: string;
    examsQueryKey: string[];
}) {
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const deleteExamMutation = useMutation({
        mutationFn: api.deleteExam,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'examen a bien été supprimé.`,
            });
            queryClient.invalidateQueries({ queryKey: props.examsQueryKey });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: `Une erreur est survenue. L'examen n'a pas pu être supprimé`,
            });
        },
    });

    const duplicateExamMutation = useMutation({
        mutationFn: api.duplicateExam,
        onSuccess: (exam) => {
            displayAlert({
                variant: 'success',
                text: `L'examen "${exam.name}" a bien été dupliqué`,
            });
            queryClient.invalidateQueries({ queryKey: props.examsQueryKey });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'examen n'a pas pu être dupliqué",
            });
        },
    });

    const [currentOptionMenu, setCurrentOptionMenu] = useState<{
        element: HTMLElement;
        examId: string;
    } | null>(null);

    return (
        <Container>
            <Menu
                anchorEl={currentOptionMenu?.element}
                open={!!currentOptionMenu}
                onClose={closeEditionMenu}
            >
                <MenuItem onClick={buildDuplicateExam(currentOptionMenu?.examId)}>
                    <ListItemIcon>
                        <ScannerIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dupliquer</ListItemText>
                </MenuItem>

                <ImportantMenuItem onClick={buildDeleteExam(currentOptionMenu?.examId)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </ImportantMenuItem>
            </Menu>
            <TitleContainer>
                <Typography variant="h3">{props.title}</Typography>
            </TitleContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={10}></TableCell>
                        <TableCell>Nom de l'examen</TableCell>
                        <TableCell width={170}>Durée</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.exams.map((exam) => (
                        <ClickableTableRow hover key={exam.id} onClick={handleRowClick(exam.id)}>
                            <TableCell>
                                <IconButton
                                    title="Actions"
                                    IconComponent={MoreHorizIcon}
                                    onClick={buildOpenOptionMenu(exam.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <EditableName exam={exam} />
                            </TableCell>
                            <TableCell>
                                <EditableExamDuration exam={exam} />
                            </TableCell>
                        </ClickableTableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
    function closeEditionMenu() {
        setCurrentOptionMenu(null);
    }

    function buildDuplicateExam(examId: string | undefined) {
        return () => {
            if (!examId) {
                return;
            }
            closeEditionMenu();
            duplicateExamMutation.mutate({ examId });
        };
    }

    function buildDeleteExam(examId: string | undefined) {
        return () => {
            if (!examId) {
                return;
            }
            closeEditionMenu();
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cet examen ? Tous les résultats liés à cet examen seront supprimés.',
            );
            if (hasConfirmed) {
                deleteExamMutation.mutate(examId);
            }
        };
    }

    function handleRowClick(examId: string) {
        return () => {
            const path = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', {
                examId,
                establishmentId: props.establishmentId,
                classeId: props.classeId,
            });
            navigate(path);
        };
    }

    function buildOpenOptionMenu(examId: string) {
        return (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();

            setCurrentOptionMenu({ element: event.currentTarget, examId });
        };
    }
}

const TitleContainer = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));
const ImportantMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.error.main,
    '.MuiListItemIcon-root': { color: theme.palette.error.main },
}));
const ClickableTableRow = styled(TableRow)({ cursor: 'pointer' });
const Container = styled('div')(({ theme }) => ({}));
export { ExamTable };
