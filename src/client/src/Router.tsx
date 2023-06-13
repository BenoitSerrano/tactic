import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ExamCreation } from './pages/ExamCreation';

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/creation-examen" element={<ExamCreation />} />
        </Routes>
    );
}

export { Router };
