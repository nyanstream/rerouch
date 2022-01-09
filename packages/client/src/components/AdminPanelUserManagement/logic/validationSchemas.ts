import * as yup from 'yup';

const textValidationSchema = yup.string().min(1).required();

export const ChangePasswordValidationSchema = yup.object({
    password: textValidationSchema,
});
