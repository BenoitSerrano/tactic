import { useQuery } from '@tanstack/react-query';
import { Loader } from '../components/Loader';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { IconButton } from '../components/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { pathHandler } from '../lib/pathHandler';
import { examApiType } from './Classe/types';
import { time } from '../lib/time';
import { examsApi } from '../lib/api/examsApi';

function AdminTeacherExams() {
    const params = useParams();
    const userId = params.userId as string;
    const navigate = useNavigate();
    const query = useQuery<examApiType[]>({
        queryKey: ['users', userId, 'exams'],
        queryFn: () => examsApi.getExamsByUser(userId),
    });
    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }
    return (
        <Table>
            <TableHead>
                <TableCell>Nom</TableCell>
                <TableCell>Durée</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell width={20}></TableCell>
            </TableHead>
            <TableBody>
                {query.data.map((exam) => {
                    const detailPath = pathHandler.getRoutePath('EXAM_PREVIEWING', {
                        examId: exam.id,
                    });
                    return (
                        <TableRow key={exam.id}>
                            <TableCell>{exam.name}</TableCell>
                            <TableCell>
                                {exam.duration !== null ? (
                                    time.formatToClock(exam.duration * 60)
                                ) : (
                                    <Tooltip title="Cet examen n'a pas de durée">
                                        <TimerOffOutlinedIcon />
                                    </Tooltip>
                                )}
                            </TableCell>
                            <TableCell>
                                {time.formatToReadable(new Date(exam.createdAt), {
                                    shouldDisplayTime: true,
                                })}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    IconComponent={VisibilityIcon}
                                    title="Voir le détail"
                                    onClick={() => navigate(detailPath)}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export { AdminTeacherExams };
