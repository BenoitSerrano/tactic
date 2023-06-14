import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:examId/take" element={<Home />} />
            <Route path="/exams/:examId/edit" element={<ExamEdition />} />
        </Routes>
    );
}

export { Router };
