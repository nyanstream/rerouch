import * as yup from 'yup';

const textValidationSchema = yup.string().min(1).required();

export const AdminLoginValidationSchema = yup.object({
    username: textValidationSchema,
    password: textValidationSchema,
    captcha: textValidationSchema,
});
