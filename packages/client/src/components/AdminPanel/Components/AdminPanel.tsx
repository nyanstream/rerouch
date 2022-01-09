import { lazy, useCallback } from 'react';
import { useRoutes } from 'react-router-dom';

import * as ROUTES from '../../App/routes';

import { Suspense } from '../../common';

const AdminPanelSchedule = lazy(() => import('../../AdminPanelSchedule/Components/AdminPanelScheduleContainer'));
const AdminPanelUserManagement = lazy(() => import('../../AdminPanelUserManagement/Components/UserManagementContainer'));

import Header from './Header/HeaderContainer';

import './AdminPanel.scss';

const AdminPanel: React.FC = () => {
    const cleanRoute = useCallback((route: string) => {
        return route.replace(ROUTES.ADMIN_PAGE_ROUTE, '');
    }, []);

    const Routes = useRoutes([
        {
            path: cleanRoute(ROUTES.ADMIN_PAGE_SCHEDULE_ROUTE),
            element: (
                <Suspense>
                    <AdminPanelSchedule />
                </Suspense>
            ),
        },
        {
            path: cleanRoute(ROUTES.ADMIN_PAGE_NOTIFICATIONS_ROUTE),
            element: (
                <Suspense>
                    <>{ROUTES.ADMIN_PAGE_NOTIFICATIONS_ROUTE}</>
                </Suspense>
            ),
        },
        {
            path: cleanRoute(ROUTES.ADMIN_PAGE_NEWS_ROUTE),
            element: (
                <Suspense>
                    <>{ROUTES.ADMIN_PAGE_NEWS_ROUTE}</>
                </Suspense>
            ),
        },
        {
            path: cleanRoute(ROUTES.ADMIN_PAGE_USER_MANAGEMENT_ROUTE),
            element: (
                <Suspense>
                    <AdminPanelUserManagement />
                </Suspense>
            ),
        },
    ]);

    return (
        <div className="adminPanel">
            <Header />

            <main className="adminPanel__content">{Routes}</main>
        </div>
    );
};

export default AdminPanel;
