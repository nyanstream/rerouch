import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import type { ChangePasswordQueryParamsType } from '../../../../api/services/userService/types';

import { getIsChangePasswordQueryPending, getChangePasswordQueryResult } from '../../AdminPanelUserManagementReduxSelectors';

import { changePasswordThunk } from '../../AdminPanelUserManagementReduxSlice';

import ChangePasswordForm from './ChangePasswordForm';

const ChangePasswordFormContainer: React.FC = () => {
    const IsChangePasswordQueryPending = useSelector(getIsChangePasswordQueryPending);
    const ChangePasswordQueryResult = useSelector(getChangePasswordQueryResult);

    const dispatch = useDispatch();

    useEffect(() => {
        if (ChangePasswordQueryResult) {
            const { success } = ChangePasswordQueryResult;

            const content = success ? 'Пароль успешно сменён' : 'Ошибка!';
            const type = success ? 'success' : 'error';

            toast[type](content);
        }
    }, [ChangePasswordQueryResult]);

    const handleNewPassword = useCallback(
        (params: ChangePasswordQueryParamsType) => {
            dispatch(changePasswordThunk(params));
        },
        [dispatch]
    );

    return <ChangePasswordForm {...{ handleNewPassword }} {...{ IsChangePasswordQueryPending }} />;
};

export default ChangePasswordFormContainer;
