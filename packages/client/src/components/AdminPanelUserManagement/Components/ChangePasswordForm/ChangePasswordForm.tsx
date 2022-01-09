import { useRef, useCallback } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';

import type { ChangePasswordQueryParamsType } from '../../../../api/services/userService/types';

import { TextInput, Button } from '../../../common';

import { ChangePasswordValidationSchema } from '../../logic/validationSchemas';

import './ChangePasswordForm.scss';

type PropsType = {
    IsChangePasswordQueryPending: boolean;
    handleNewPassword: (data: ChangePasswordQueryParamsType) => void;
};

const ChangePasswordForm: React.FC<PropsType> = props => {
    const { IsChangePasswordQueryPending } = props;
    const { handleNewPassword } = props;

    const initialValues = useRef<ChangePasswordQueryParamsType>({
        password: '',
    });

    const submitHandler = useCallback(
        async (values: ChangePasswordQueryParamsType, helpers: FormikHelpers<ChangePasswordQueryParamsType>) => {
            handleNewPassword(values);
            helpers.resetForm();
        },
        [handleNewPassword]
    );

    return (
        <Formik initialValues={initialValues.current} onSubmit={submitHandler} validationSchema={ChangePasswordValidationSchema}>
            {({ isSubmitting, dirty, isValidating, isValid }) => {
                const isSubmitDisabled = IsChangePasswordQueryPending || isSubmitting || isValidating || !isValid || !dirty;

                return (
                    <Form className="userManagement__changePasswordForm">
                        <Field
                            name="password"
                            type="password"
                            className="userManagement__changePasswordForm__formItem"
                            label="Введите новый пароль"
                            placeholder="Новый пароль"
                            labelHidden
                            required
                            component={TextInput}
                        />

                        <div className="userManagement__changePasswordForm__submitBox">
                            <Button type="submit" disabled={isSubmitDisabled}>
                                Сменить
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default ChangePasswordForm;
