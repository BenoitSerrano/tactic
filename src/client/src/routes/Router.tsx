import { Routes, Route } from 'react-router-dom';

import { NotFound } from '../pages/NotFound';
import { AdminPage } from '../components/AdminPage';

import { ROUTE_ELEMENTS } from './routeElements';
import { ROUTE_KEYS } from './routeKeys';
import { ROUTE_PATHS } from './routePaths';
import { TitleWrapper } from './TitleWrapper';
import { ROUTE_TITLES } from './routeTitles';

function Router() {
    return (
        <Routes>
            {ROUTE_KEYS.map((routeKey) => {
                const { isAdmin, element } = ROUTE_ELEMENTS[routeKey];
                const { path } = ROUTE_PATHS[routeKey];
                const documentTitle = ROUTE_TITLES[routeKey];

                return isAdmin ? (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <AdminPage>
                                <TitleWrapper documentTitle={documentTitle}>{element}</TitleWrapper>
                            </AdminPage>
                        }
                    />
                ) : (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <TitleWrapper documentTitle={documentTitle}>{element}</TitleWrapper>
                        }
                    />
                );
            })}

            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
}

export { Router };
