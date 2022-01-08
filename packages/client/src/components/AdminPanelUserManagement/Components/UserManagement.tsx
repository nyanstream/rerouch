import { useMemo } from 'react';
import { UserRoles } from '../../../api/services/userService/types';

import { Section } from '../../common';

import type { AdminLoginStateType } from '../../AdminLogin/AdminLoginTypes';

import './UserManagement.scss';

type PropsType = {
    UserInfo: NonNullable<AdminLoginStateType['UserInfo']>;
};

const UserManagement: React.FC<PropsType> = props => {
    const { UserInfo } = props;

    const userRoles = useMemo(() => {
        return (
            <ul>
                {UserInfo.roles.map(roleId => (
                    <li>{UserRoles[roleId]}</li>
                ))}
            </ul>
        );
    }, [UserInfo.roles]);

    return (
        <div className="userManagement">
            <Section title="Информация о пользователе">
                <div>
                    Имя пользователя: <strong>{UserInfo.username}</strong>
                </div>

                <div className="userManagement__roles">Роли: {userRoles}</div>
            </Section>

            <Section title="Смена пароля">
                <div>Пока недоступно</div>
            </Section>
        </div>
    );
};

export default UserManagement;
