import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader } from '../components/Loader';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { IconButton } from '../components/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../lib/pathHandler';

type userRoleType = 'teacher' | 'admin';
type planType = { id: string; name: string };
type userSummaryApiType = {
    id: string;
    email: string;
    role: userRoleType;
    plan: planType;
    examsCount: number;
};

function AdminDashboard() {
    const navigate = useNavigate();
    const query = useQuery<userSummaryApiType[]>({
        queryKey: ['users-summary'],
        queryFn: api.fetchUsersSummary,
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
                <TableCell>E-mail</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Nombre d'examens</TableCell>
                <TableCell width={20}></TableCell>
            </TableHead>
            <TableBody>
                {query.data.map((user) => {
                    const detailPath = pathHandler.getRoutePath('ADMIN_TEACHER_EXAMS', {
                        userId: user.id,
                    });
                    return (
                        <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.plan.name}</TableCell>
                            <TableCell>{user.examsCount}</TableCell>
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

export { AdminDashboard };
