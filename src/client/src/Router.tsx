import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';
import { StudentsEdition } from './pages/StudentsEdition';

function Router() {
    return (
        <Routes>
            <Route path="/teacher/exams" element={<Exams />} />
            <Route path="/teacher/students" element={<StudentsEdition />} />
            <Route path="/teacher/exams/:examId/edit" element={<ExamEdition />} />
        </Routes>
    );
}

export { Router };
