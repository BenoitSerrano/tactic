import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader } from '../components/Loader';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

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
            </TableHead>
            <TableBody>
                {query.data.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.plan.name}</TableCell>
                        <TableCell>{user.examsCount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export { AdminDashboard };
