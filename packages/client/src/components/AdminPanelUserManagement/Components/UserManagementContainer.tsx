import { useSelector } from 'react-redux';

import { getUserInfo } from '../../AdminLogin/AdminLoginReduxSelectors';

import UserManagement from './UserManagement';

const UserManagementContainer: React.FC = () => {
    const UserInfo = useSelector(getUserInfo);

    if (!UserInfo) {
        return null;
    }

    return <UserManagement {...{ UserInfo }} />;
};

export default UserManagementContainer;
