import { Navigate, useParams } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';

function ExamList() {
    const params = useParams();
    const establishmentId = params.establishmentId as string;
    const path = pathHandler.getRoutePath('EXAM_LIST_ALL', { establishmentId });

    return <Navigate to={path} />;
}
export { ExamList };
