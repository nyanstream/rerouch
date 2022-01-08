import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Navigate } from 'react-router-dom';

import { ADMIN_PAGE_DEFAULT_ROUTE } from '../../App/routes';

import { loginThunk, checkAuthThunk } from '../AdminLoginReduxSlice';
import { resetLoginError } from '../AdminLoginReduxSlice';

import { getIsUserLoggedIn, getIsLoginPending, getIsLogihError, getIsLoginCheckComplete } from '../AdminLoginReduxSelectors';

import AdminLogin from './AdminLogin';

const AdminLoginContainer: React.FC = () => {
    const IsUserLoggedIn = useSelector(getIsUserLoggedIn);
    const IsLoginPending = useSelector(getIsLoginPending);
    const IsLogihError = useSelector(getIsLogihError);
    const IsLoginCheckComplete = useSelector(getIsLoginCheckComplete);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuthThunk());

        return () => {
            dispatch(resetLoginError());
        };
    }, []);

    const formDataHandler = useCallback((data: Parameters<typeof loginThunk>[0]) => {
        dispatch(loginThunk(data));
    }, []);

    if (!IsLoginCheckComplete) return null;

    if (IsUserLoggedIn) return <Navigate to={ADMIN_PAGE_DEFAULT_ROUTE} />;

    return <AdminLogin {...{ IsLoginPending, IsLogihError }} {...{ formDataHandler }} />;
};

export default AdminLoginContainer;
