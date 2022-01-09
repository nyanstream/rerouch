import { useCallback } from 'react';
import { ReCaptchaProvider, ReCaptchaV2 as ReCaptcha, EReCaptchaV2Size } from 'react-recaptcha-x';
import classnames from 'classnames';

import type { FieldProps } from 'formik';

import CONFIG from '../../../config';

import './CaptchaInput.scss';

type PropsTyp = FieldProps & {
    className?: string;
};

export const CaptchaInput: React.FC<PropsTyp> = props => {
    const { form, field } = props;
    const { className } = props;

    const reCaptchaCallback = useCallback(
        (token: string | boolean | Error) => {
            if (token instanceof Error) {
                alert(token);
                return;
            }

            if (!token) {
                form.setFieldValue(field.name, undefined);
            }

            if (typeof token === 'string') {
                form.setFieldValue(field.name, token);
            }
        },
        [form, field]
    );

    return (
        <ReCaptchaProvider siteKeyV2={CONFIG.API_KEYS.recaptcha}>
            <div className={classnames('rr-formItem', 'rr-formItem--captcha', className)}>
                <ReCaptcha size={EReCaptchaV2Size.Normal} callback={reCaptchaCallback} />

                <input {...field} className={classnames('rr-formItem__input', { [`${className}__input`]: !!className })} required hidden />
            </div>
        </ReCaptchaProvider>
    );
};
