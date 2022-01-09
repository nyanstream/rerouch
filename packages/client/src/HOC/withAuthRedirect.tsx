import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { ADMIN_LOGIN_ROUTE } from '../components/App/routes';

import { getIsUserLoggedIn, getIsLoginCheckComplete } from '../components/AdminLogin/AdminLoginReduxSelectors';

export const withAuthRedirect = (Component: React.ComponentType): React.FunctionComponent => {
    return props => {
        const IsLoginCheckComplete = useSelector(getIsLoginCheckComplete);
        const IsUserLoggedIn = useSelector(getIsUserLoggedIn);

        if (IsLoginCheckComplete && !IsUserLoggedIn) {
            return <Navigate to={ADMIN_LOGIN_ROUTE} />;
        }

        return <Component {...props} />;
    };
};
