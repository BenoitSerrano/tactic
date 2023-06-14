import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';
import { Students } from './pages/Students';

function Router() {
    return (
        <Routes>
            <Route path="/exams" element={<Exams />} />
            <Route path="/students" element={<Students />} />
            <Route path="/exams/:examId/edit" element={<ExamEdition />} />
        </Routes>
    );
}

export { Router };
