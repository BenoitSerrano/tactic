import { Navigate } from 'react-router-dom';
import { pathHandler } from '../lib/pathHandler';

function TeacherHome() {
    return <Navigate to={pathHandler.getRoutePath('EXAM_LIST_FOR_ALL')} />;
}

export { TeacherHome };
