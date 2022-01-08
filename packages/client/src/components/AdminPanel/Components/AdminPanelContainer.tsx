import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { withAuthRedirect } from '../../../HOC';

import { getCurrentUserInfoThunk } from '../../AdminLogin/AdminLoginReduxSlice';

import AdminPanel from './AdminPanel';

const AdminPanelContainer: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCurrentUserInfoThunk());
    }, [dispatch]);

    return <AdminPanel />;
};

export default withAuthRedirect(AdminPanelContainer);
