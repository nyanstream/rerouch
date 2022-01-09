import * as yup from 'yup';

const textValidationSchema = yup.string().min(1).required();

const booleanValidationSchema = yup.boolean().required();

export const CreateAirValidationSchema = yup.object({
    text: textValidationSchema,
    streamerId: textValidationSchema,
    startDate: textValidationSchema,
    endDate: textValidationSchema,
    hidden: booleanValidationSchema,
});
