import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';
import { StudentsEdition } from './pages/StudentsEdition';
import { StudentAuthentication } from './pages/StudentAuthentication';
import { ExamTaking } from './pages/ExamTaking';
import { ExamResults } from './pages/ExamResults';
import { ExamChecking } from './pages/ExamChecking';
import { TeacherHome } from './pages/TeacherHome';
import { ExamDone } from './pages/ExamDone';
import { AttemptAlreadySubmitted } from './pages/AttemptAlreadySubmitted';
import { AttemptTimeout } from './pages/AttemptTimeout';
import { StudentHome } from './pages/StudentHome';
import { EmptyAttemptCreated } from './pages/EmptyAttemptCreated';

function Router() {
    return (
        <Routes>
            <Route path="/teacher/exams" element={<Exams />} />
            <Route path="/teacher/students" element={<StudentsEdition />} />
            <Route path="/teacher/exams/:examId/edit" element={<ExamEdition />} />
            <Route path="/teacher/exams/:examId/results" element={<ExamResults />} />
            <Route path="/teacher" element={<TeacherHome />} />
            <Route path="/teacher/attempts/:attemptId" element={<ExamChecking />} />
            <Route path="/student/exams/:examId" element={<StudentAuthentication />} />
            <Route path="/student/exams/:examId/students/:studentId" element={<StudentHome />} />
            <Route path="/student/:studentId/attempts/:attemptId" element={<ExamTaking />} />
            <Route path="/student/:studentId/exam-done" element={<ExamDone />} />
            <Route
                path="/student/attempt-already-submitted"
                element={<AttemptAlreadySubmitted />}
            />
            <Route path="/student/attempt-timeout" element={<AttemptTimeout />} />
            <Route path="/student/empty-attempt-created" element={<EmptyAttemptCreated />} />
        </Routes>
    );
}

export { Router };
