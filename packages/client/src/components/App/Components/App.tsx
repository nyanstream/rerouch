import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Suspense } from '../../common';

import * as ROUTES from '../routes';

const AdminLogin = React.lazy(() => import('../../AdminLogin/Components/AdminLoginContainer'));
const AdminPanel = React.lazy(() => import('../../AdminPanel/Components/AdminPanelContainer'));
const AdminPanelUserManagement = React.lazy(() => import('../../AdminPanelUserManagement/Components/UserManagementContainer'));

const App: React.FC = () => {
    return (
        <Routes>
            <Route
                path={ROUTES.ADMIN_LOGIN_ROUTE}
                element={
                    <Suspense>
                        <AdminLogin />
                    </Suspense>
                }
            />

            <Route
                path={ROUTES.ADMIN_PAGE_ROUTE}
                element={
                    <Suspense>
                        <AdminPanel />
                    </Suspense>
                }>
                <Route
                    path={ROUTES.ADMIN_PAGE_SCHEDULE_ROUTE}
                    element={
                        <Suspense>
                            <>{ROUTES.ADMIN_PAGE_SCHEDULE_ROUTE}</>
                        </Suspense>
                    }
                />

                <Route
                    path={ROUTES.ADMIN_PAGE_NOTIFICATIONS_ROUTE}
                    element={
                        <Suspense>
                            <>{ROUTES.ADMIN_PAGE_NOTIFICATIONS_ROUTE}</>
                        </Suspense>
                    }
                />

                <Route
                    path={ROUTES.ADMIN_PAGE_NEWS_ROUTE}
                    element={
                        <Suspense>
                            <>{ROUTES.ADMIN_PAGE_NEWS_ROUTE}</>
                        </Suspense>
                    }
                />

                <Route
                    path={ROUTES.ADMIN_PAGE_USER_MANAGEMENT_ROUTE}
                    element={
                        <Suspense>
                            <AdminPanelUserManagement />
                        </Suspense>
                    }
                />
            </Route>

            <Route path={ROUTES.ADMIN_PAGE_ROUTE} element={<Navigate to={ROUTES.ADMIN_PAGE_DEFAULT_ROUTE} />} />
        </Routes>
    );
};

export default App;
