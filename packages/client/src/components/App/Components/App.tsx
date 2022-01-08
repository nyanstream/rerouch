import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import * as ROUTES from '../routes';

const AdminLogin = React.lazy(() => import('../../AdminLogin/Components/AdminLoginContainer'));

const App: React.FC = () => {
    return (
        <Routes>
            <Route
                path={ROUTES.ADMIN_LOGIN_ROUTE}
                element={
                    <React.Suspense fallback="Загрузка...">
                        <AdminLogin />
                    </React.Suspense>
                }
            />

            <Route path={ROUTES.ADMIN_PAGE_ROUTE} element={<Navigate to={ROUTES.ADMIN_PAGE_DEFAULT_ROUTE} />} />

            <Route
                path={`${ROUTES.ADMIN_PAGE_ROUTE}/*`}
                element={
                    <React.Suspense fallback="Загрузка...">
                        <>123</>
                    </React.Suspense>
                }
            />
        </Routes>
    );
};

export default App;
