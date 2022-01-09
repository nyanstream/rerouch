import { useRef, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';

import type { LoginQueryParamsType } from '../../../api/services/authService/types';
import type { AdminLoginStateType } from '../AdminLoginTypes';

import { TextInput, CaptchaInput, Button } from '../../common';

import { AdminLoginValidationSchema } from '../logic/validationSchemas';

import './AdminLogin.scss';

type PropsType = Pick<AdminLoginStateType, 'IsLoginPending' | 'IsLoginError'> & {
    formDataHandler: (data: LoginQueryParamsType) => void;
};

const AdminLogin: React.FC<PropsType> = props => {
    const { IsLoginPending, IsLoginError } = props;
    const { formDataHandler } = props;

    const initialValues = useRef<LoginQueryParamsType>({
        username: '',
        password: '',
        captcha: '',
    });

    const submitHandler = useCallback(
        async (values: LoginQueryParamsType) => {
            formDataHandler(values);
        },
        [formDataHandler]
    );

    return (
        <div className="adminLogin">
            <h1>Авторизация</h1>

            <Formik initialValues={initialValues.current} validationSchema={AdminLoginValidationSchema} onSubmit={submitHandler}>
                {({ isSubmitting, dirty, isValidating, isValid }) => {
                    const isSubmitDisabled = IsLoginPending || isSubmitting || isValidating || !isValid || !dirty;

                    return (
                        <Form className="adminLogin__form">
                            <Field
                                name="username"
                                type="text"
                                className="adminLogin__formItem"
                                label="Введите логин"
                                placeholder="Логин"
                                labelHidden
                                required
                                component={TextInput}
                            />

                            <Field
                                name="password"
                                type="password"
                                className="adminLogin__formItem"
                                label="Введите пароль"
                                placeholder="Пароль"
                                labelHidden
                                required
                                component={TextInput}
                            />

                            <Field name="captcha" className="adminLogin__formItem" component={CaptchaInput} />

                            <div className="adminLogin__submitBox">
                                <Button type="submit" disabled={isSubmitDisabled}>
                                    Войти
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>

            {IsLoginError ? <div className="adminLogin__error">ошибка авторизации</div> : null}
        </div>
    );
};

export default AdminLogin;
