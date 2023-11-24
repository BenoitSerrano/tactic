import { Routes, Route } from 'react-router-dom';

import { NotFound } from '../pages/NotFound';
import { AdminPage } from '../components/AdminPage';

import { ROUTE_ELEMENTS } from './routeElements';
import { ROUTE_KEYS } from './routeKeys';
import { ROUTE_PATHS } from './routePaths';

function Router() {
    return (
        <Routes>
            {ROUTE_KEYS.map((key) => {
                const { isAdmin, element } = ROUTE_ELEMENTS[key];
                const { path } = ROUTE_PATHS[key];
                return isAdmin ? (
                    <Route key={path} path={path} element={<AdminPage>{element}</AdminPage>} />
                ) : (
                    <Route key={path} path={path} element={element} />
                );
            })}

            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
}

export { Router };
