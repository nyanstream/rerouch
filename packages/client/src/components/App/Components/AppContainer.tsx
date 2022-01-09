import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { checkAuthThunk } from '../../AdminLogin/AdminLoginReduxSlice';

import * as ROUTES from '../routes';

import App from './App';

const AppContainer: React.FC = () => {
    const { pathname: LocationPathname } = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuthThunk());
    }, [dispatch]);

    if (!Object.values(ROUTES).includes(LocationPathname)) {
        return <Navigate to={ROUTES.ADMIN_LOGIN_ROUTE} />;
    }

    return (
        <>
            <App />
            <ToastContainer position="top-center" autoClose={2000} />
        </>
    );
};

export default AppContainer;
