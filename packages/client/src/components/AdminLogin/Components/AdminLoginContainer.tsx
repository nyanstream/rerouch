import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Navigate } from 'react-router-dom';

import { ADMIN_PAGE_DEFAULT_ROUTE } from '../../App/routes';

import { loginThunk } from '../AdminLoginReduxSlice';
import { resetLoginError } from '../AdminLoginReduxSlice';

import { getIsUserLoggedIn, getIsLoginPending, getIsLoginError, getIsLoginCheckComplete } from '../AdminLoginReduxSelectors';

import AdminLogin from './AdminLogin';

const AdminLoginContainer: React.FC = () => {
    const IsUserLoggedIn = useSelector(getIsUserLoggedIn);
    const IsLoginPending = useSelector(getIsLoginPending);
    const IsLoginError = useSelector(getIsLoginError);
    const IsLoginCheckComplete = useSelector(getIsLoginCheckComplete);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(resetLoginError());
        };
    }, [dispatch]);

    const formDataHandler = useCallback((data: Parameters<typeof loginThunk>[0]) => {
        dispatch(loginThunk(data));
    }, []);

    if (!IsLoginCheckComplete) return null;

    if (IsUserLoggedIn) return <Navigate to={ADMIN_PAGE_DEFAULT_ROUTE} />;

    return <AdminLogin {...{ IsLoginPending, IsLoginError }} {...{ formDataHandler }} />;
};

export default AdminLoginContainer;
