import { useLocation, Navigate } from 'react-router-dom';

import * as ROUTES from '../routes';

import App from './App';

const AppContainer: React.FC = () => {
    const { pathname: LocationPathname } = useLocation();

    if (!Object.values(ROUTES).includes(LocationPathname)) {
        return <Navigate to={ROUTES.ADMIN_LOGIN_ROUTE} />;
    }

    return <App />;
};

export default AppContainer;
