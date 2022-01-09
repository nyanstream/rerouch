import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

import { Suspense } from '../../common';

import * as ROUTES from '../routes';

const AdminLogin = lazy(() => import('../../AdminLogin/Components/AdminLoginContainer'));
const AdminPanel = lazy(() => import('../../AdminPanel/Components/AdminPanelContainer'));

const App: React.FC = () => {
    const Routes = useRoutes([
        {
            path: ROUTES.ADMIN_LOGIN_ROUTE,
            element: (
                <Suspense>
                    <AdminLogin />
                </Suspense>
            ),
        },
        {
            path: `${ROUTES.ADMIN_PAGE_ROUTE}/*`,
            element: (
                <Suspense>
                    <AdminPanel />
                </Suspense>
            ),
        },
    ]);

    return Routes;
};

export default App;
