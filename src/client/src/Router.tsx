import { Routes, Route } from 'react-router-dom';

import { NotFound } from './pages/NotFound';
import { AdminPage } from './components/AdminPage';

import { ROUTES } from './routes';

function Router() {
    return (
        <Routes>
            {Object.values(ROUTES).map(({ element, path, isAdmin }) =>
                isAdmin ? (
                    <Route key={path} path={path} element={<AdminPage>{element}</AdminPage>} />
                ) : (
                    <Route key={path} path={path} element={element} />
                ),
            )}

            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
}

export { Router };
