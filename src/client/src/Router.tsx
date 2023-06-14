import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ExamCreation } from './pages/ExamCreation';
import { Exams } from './pages/Exams';

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/creation-examen" element={<ExamCreation />} />
            <Route path="/examens" element={<Exams />} />
        </Routes>
    );
}

export { Router };
