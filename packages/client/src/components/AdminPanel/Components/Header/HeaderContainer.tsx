import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getIsLoginPending } from '../../../AdminLogin/AdminLoginReduxSelectors';

import { logoutThunk } from '../../../AdminLogin/AdminLoginReduxSlice';

import Header from './Header';

const HeaderContainer: React.FC = () => {
    const IsLoginPending = useSelector(getIsLoginPending);

    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        dispatch(logoutThunk());
    }, [dispatch]);

    return <Header {...{ IsLoginPending, handleLogout }} />;
};

export default HeaderContainer;
