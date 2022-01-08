import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { ADMIN_LOGIN_ROUTE } from '../components/App/routes';

import { getIsUserLoggedIn } from '../components/AdminLogin/AdminLoginReduxSelectors';

export const withAuthRedirect = (Component: React.ComponentType): React.FunctionComponent => {
    return props => {
        const IsUserLoggedIn = useSelector(getIsUserLoggedIn);

        if (!IsUserLoggedIn) {
            return <Navigate to={ADMIN_LOGIN_ROUTE} />;
        }

        return <Component {...props} />;
    };
};
