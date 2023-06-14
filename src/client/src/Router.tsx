import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ExamCreation } from './pages/ExamCreation';
import { Exams } from './pages/Exams';

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:examId/take" element={<Home />} />
            <Route path="/exams/:examId/edit" element={<ExamCreation />} />
        </Routes>
    );
}

export { Router };
