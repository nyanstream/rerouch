import * as yup from 'yup';
import dayjs from 'dayjs';

const textValidationSchema = yup.string().required();

const linkValidationSchema = yup.string().url().notRequired();

const streamerIdSchema = yup.string().notRequired();

const numberValidationSchema = yup.number().min(1).required();

const dateValidationSchema = yup
    .string()
    .required()
    .test('is-date', 'Неверный формат даты!', value => {
        return dayjs(value).isValid();
    });

const booleanValidationSchema = yup.boolean().required();

export const CreateAirValidationSchema = yup
    .object({
        text: textValidationSchema,
        link: linkValidationSchema,
        streamer_id: streamerIdSchema,
        start_date: dateValidationSchema,
        duration: numberValidationSchema,
        hidden: booleanValidationSchema,
    })
    .required();

export type CreateAirFormValuesType = yup.InferType<typeof CreateAirValidationSchema>;
