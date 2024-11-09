import {
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { IconButton } from '../../components/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { EditableName } from './EditableName';
import { EditableDuration } from './EditableDuration';
import { examApiType } from './types';
import { pathHandler } from '../../lib/pathHandler';
import { useNavigate } from 'react-router-dom';

function ExamTable(props: {
    exams: examApiType[];
    title: string;
    setCurrentOptionMenu: (params: { element: HTMLElement; examId: string }) => void;
}) {
    const navigate = useNavigate();

    return (
        <Container>
            <Typography>{props.title}</Typography>
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
                                <EditableDuration exam={exam} />
                            </TableCell>
                        </ClickableTableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );

    function handleRowClick(examId: string) {
        return () => {
            const path = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId });
            navigate(path);
        };
    }

    function buildOpenOptionMenu(examId: string) {
        return (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();

            props.setCurrentOptionMenu({ element: event.currentTarget, examId });
        };
    }
}

const ClickableTableRow = styled(TableRow)({ cursor: 'pointer' });
const Container = styled('div')(({ theme }) => ({}));
export { ExamTable };
