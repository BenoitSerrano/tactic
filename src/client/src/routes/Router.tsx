import { Routes, Route } from 'react-router-dom';

import { ROUTE_ELEMENTS } from './routeElements';
import { ROUTE_KEYS } from './routeKeys';
import { ROUTE_PATHS } from './routePaths';
import { TitleWrapper } from './TitleWrapper';
import { ROUTE_TITLES } from './routeTitles';
import { TeacherPage } from '../components/TeacherPage';
import { AdminPage } from '../components/TeacherPage/AdminPage';

function Router() {
    return (
        <Routes>
            {ROUTE_KEYS.map((routeKey) => {
                const { authorizedRole, element } = ROUTE_ELEMENTS[routeKey];
                const { path } = ROUTE_PATHS[routeKey];
                const documentTitle = ROUTE_TITLES[routeKey];
                if (!authorizedRole) {
                    return (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <TitleWrapper documentTitle={documentTitle}>{element}</TitleWrapper>
                            }
                        />
                    );
                }

                switch (authorizedRole) {
                    case 'teacher':
                        return (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <TeacherPage>
                                        <TitleWrapper documentTitle={documentTitle}>
                                            {element}
                                        </TitleWrapper>
                                    </TeacherPage>
                                }
                            />
                        );
                    case 'admin':
                        return (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <AdminPage>
                                        <TitleWrapper documentTitle={documentTitle}>
                                            {element}
                                        </TitleWrapper>
                                    </AdminPage>
                                }
                            />
                        );
                }
            })}
        </Routes>
    );
}

export { Router };
