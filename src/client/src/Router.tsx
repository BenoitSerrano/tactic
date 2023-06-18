import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';
import { StudentsEdition } from './pages/StudentsEdition';
import { StudentAuthentication } from './pages/StudentAuthentication';
import { ExamTaking } from './pages/ExamTaking';
import { ExamResults } from './pages/ExamResults';
import { ExamChecking } from './pages/ExamChecking';

function Router() {
    return (
        <Routes>
            <Route path="/teacher/exams" element={<Exams />} />
            <Route path="/teacher/students" element={<StudentsEdition />} />
            <Route path="/teacher/exams/:examId/edit" element={<ExamEdition />} />
            <Route path="/teacher/exams/:examId/results" element={<ExamResults />} />
            <Route path="/teacher/attempts/:attemptId" element={<ExamChecking />} />
            <Route path="/student/exams/:examId" element={<StudentAuthentication />} />
            <Route path="/student/attempts/:attemptId" element={<ExamTaking />} />
        </Routes>
    );
}

export { Router };
