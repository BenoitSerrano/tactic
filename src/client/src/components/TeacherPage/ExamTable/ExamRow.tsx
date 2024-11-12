import { styled, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScannerIcon from '@mui/icons-material/Scanner';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import TimerIcon from '@mui/icons-material/Timer';
import { examApiType } from '../../../pages/Classe/types';
import { EditableName } from './EditableName';
import { EditableExamDuration } from '../../EditableExamDuration';
import { IconButton } from '../../IconButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { pathHandler } from '../../../lib/pathHandler';
import { useNavigate } from 'react-router-dom';
import { time } from '../../../lib/time';

function ExamRow(props: { exam: examApiType; classeId: string; establishmentId: string }) {
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const examsQueryKey = [
        'establishments',
        props.establishmentId,
        'classes',
        props.classeId,
        'exams',
    ];

    const duplicateExamMutation = useMutation({
        mutationFn: api.duplicateExam,
        onSuccess: (exam) => {
            displayAlert({
                variant: 'success',
                text: `L'examen "${exam.name}" a bien été dupliqué`,
            });
            queryClient.invalidateQueries({ queryKey: examsQueryKey });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'examen n'a pas pu être dupliqué",
            });
        },
    });

    const deleteExamMutation = useMutation({
        mutationFn: api.deleteExam,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'examen a bien été supprimé.`,
            });
            queryClient.invalidateQueries({ queryKey: examsQueryKey });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: `Une erreur est survenue. L'examen n'a pas pu être supprimé`,
            });
        },
    });

    const dateText = computeDateText(props.exam);

    return (
        <Row onClick={handleRowClick}>
            <InfoContainer>
                <TitleContainer>
                    <EditableName exam={props.exam} />
                </TitleContainer>
                <SubtitleContainer>
                    <SubinfoContainer>
                        <IconContainer>
                            <CalendarMonthIcon fontSize="small" />
                        </IconContainer>
                        <Typography>{dateText}</Typography>
                    </SubinfoContainer>
                    <SubinfoContainer>
                        <IconContainer>
                            <TimerIcon fontSize="small" />
                        </IconContainer>
                        <EditableExamDuration
                            exam={props.exam}
                            classeId={props.classeId}
                            establishmentId={props.establishmentId}
                        />
                    </SubinfoContainer>
                </SubtitleContainer>
            </InfoContainer>
            <ButtonsContainer>
                <ButtonRow>
                    <ButtonContainer>
                        <IconButton
                            onClick={duplicateExam}
                            IconComponent={ScannerIcon}
                            title="Dupliquer l'examen"
                        />
                    </ButtonContainer>
                    <ButtonContainer>
                        <IconButton
                            color="error"
                            onClick={deleteExam}
                            IconComponent={DeleteForeverIcon}
                            title="Supprimer l'examen"
                        />
                    </ButtonContainer>
                </ButtonRow>
            </ButtonsContainer>
        </Row>
    );

    function duplicateExam(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();

        duplicateExamMutation.mutate({ examId: props.exam.id });
    }

    function deleteExam(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();

        // eslint-disable-next-line no-restricted-globals
        const hasConfirmed = confirm(
            'Souhaitez-vous réellement supprimer cet examen ? Tous les résultats liés à cet examen seront supprimés.',
        );
        if (hasConfirmed) {
            deleteExamMutation.mutate(props.exam.id);
        }
    }

    function handleRowClick() {
        const path = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', {
            examId: props.exam.id,
            establishmentId: props.establishmentId,
            classeId: props.classeId,
        });
        navigate(path);
    }
}

function computeDateText(exam: examApiType) {
    const startDateTime = new Date(exam.startTime);
    const readableStartDateTime = time.formatToReadable(startDateTime);
    if (!!exam.endTime) {
        const endDateTime = new Date(exam.endTime);
        const readableEndDateTime = time.formatToReadable(endDateTime);
        if (readableStartDateTime === readableEndDateTime) {
            return readableStartDateTime;
        } else {
            return `${readableStartDateTime} - ${readableEndDateTime}`;
        }
    } else {
        return `À partir du ${readableStartDateTime}`;
    }
}

const Row = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    boxShadow: theme.shadows[1],

    display: 'flex',
    flex: 1,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    borderRadius: 10,
    background: theme.palette.primary.light,
}));
const InfoContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
}));
const ButtonsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
}));
const ButtonRow = styled('div')(({ theme }) => ({ display: 'flex' }));
const ButtonContainer = styled('div')(({ theme }) => ({}));
const TitleContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(1) }));
const SubtitleContainer = styled('div')(({ theme }) => ({ display: 'flex' }));
const SubinfoContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(3),
}));
const IconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
}));
export { ExamRow };
