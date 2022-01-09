import { useMemo } from 'react';

import { Section } from '../../common';

import type { AdminLoginStateType } from '../../AdminLogin/AdminLoginTypes';

import ChangePasswordForm from './ChangePasswordForm/ChangePasswordFormContainer';

import './UserManagement.scss';

type PropsType = {
    UserInfo: NonNullable<AdminLoginStateType['UserInfo']>;
};

const UserManagement: React.FC<PropsType> = props => {
    const { UserInfo } = props;

    const userRoles = useMemo(() => {
        return (
            <ul>
                {UserInfo.roles.map(roleInfo => (
                    <li key={roleInfo.id}>{roleInfo.title}</li>
                ))}
            </ul>
        );
    }, [UserInfo.roles]);

    const registrationDate = useMemo(() => {
        const date = new Date(UserInfo.registrationDate);
        return date.toLocaleDateString('ru', {
            hour: 'numeric',
            minute: 'numeric',
        });
    }, [UserInfo.registrationDate]);

    return (
        <div className="userManagement">
            <Section title="Информация о пользователе">
                <div>
                    Имя пользователя: <strong>{UserInfo.username}</strong>
                </div>

                <div className="userManagement__roles">Роли: {userRoles}</div>

                <div className="userManagement__roles">Дата регистрации: {registrationDate}</div>
            </Section>

            <Section title="Смена пароля">
                <ChangePasswordForm />
            </Section>
        </div>
    );
};

export default UserManagement;
