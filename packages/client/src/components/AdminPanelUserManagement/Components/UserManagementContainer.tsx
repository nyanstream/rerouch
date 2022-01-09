import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserInfo } from '../../AdminLogin/AdminLoginReduxSelectors';

import { resetStateOnUnmount } from '../AdminPanelUserManagementReduxSlice';

import UserManagement from './UserManagement';

const UserManagementContainer: React.FC = () => {
    const UserInfo = useSelector(getUserInfo);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(resetStateOnUnmount());
        };
    }, [dispatch]);

    if (!UserInfo) {
        return null;
    }

    return <UserManagement {...{ UserInfo }} />;
};

export default UserManagementContainer;
