import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';

function Router() {
    return (
        <Routes>
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:examId/edit" element={<ExamEdition />} />
        </Routes>
    );
}

export { Router };
