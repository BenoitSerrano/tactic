import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';
import { StudentsEdition } from './pages/StudentsEdition';
import { StudentAuthentication } from './pages/StudentAuthentication';
import { StudentAction } from './pages/StudentAction';

function Router() {
    return (
        <Routes>
            <Route path="/teacher/exams" element={<Exams />} />
            <Route path="/teacher/students" element={<StudentsEdition />} />
            <Route path="/teacher/exams/:examId/edit" element={<ExamEdition />} />
            <Route path="/student/exams/:examId/students" element={<StudentAuthentication />} />
            <Route path="/student/exams/:examId/students/:studentId" element={<StudentAction />} />
        </Routes>
    );
}

export { Router };
