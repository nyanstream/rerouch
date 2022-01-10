import { useCallback, useMemo } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
// import dayjs from 'dayjs';

import { formatDateToDateTimeInput } from '../../../../utils/dates';

import type { StreamersQueryResponseType } from '../../../../api/services/userService/types';
import type { CreateAirQueryParamsType } from '../../../../api/services/scheduleService/types';

import type { CreateAirFormValuesType } from './logic/validationSchemas';
import { CreateAirValidationSchema } from './logic/validationSchemas';

import { Markdown, TextInput, SelectInput, DateTimeInput, Button } from '../../../common';
import type { SelectInputPropsType } from '../../../common';

import './CreateAirForm.scss';
import dayjs from 'dayjs';

type PropsType = {
    StreamersData: StreamersQueryResponseType;
    IsCreateAirQueryPending: boolean;
    handleNewAirData: (data: CreateAirQueryParamsType) => void;
};

const CreateAirForm: React.FC<PropsType> = props => {
    const { StreamersData, IsCreateAirQueryPending } = props;
    const { handleNewAirData } = props;

    const initialValues: CreateAirFormValuesType = {
        text: '',
        link: '',
        streamer_id: '',
        start_date: formatDateToDateTimeInput(new Date()),
        duration: 60,
        hidden: false,
    };

    const submitHandler = useCallback(
        async (values: CreateAirFormValuesType, helpers: FormikHelpers<CreateAirFormValuesType>) => {
            const timeZone = 'Europe/Moscow';

            const link = values.link ?? null;
            const streamerId = values.streamer_id ? values.streamer_id : null;

            const startDate = dayjs(values.start_date);
            const endDate = dayjs(values.start_date).add(values.duration, 'minutes');

            const newAirData: CreateAirQueryParamsType = {
                text: values.text,
                link,
                streamer_id: streamerId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                dates_timezone: timeZone,
                hidden: false,
            };

            handleNewAirData(newAirData);

            helpers.resetForm({
                values: {
                    text: '',
                    link: '',
                    streamer_id: values.streamer_id,
                    start_date: formatDateToDateTimeInput(endDate),
                    duration: 60,
                    hidden: false,
                },
            });
        },
        [handleNewAirData]
    );

    const renderMarkdownPreview = useCallback((text: string) => {
        if (!text) {
            return null;
        }

        return (
            <div className="schedule__createAirForm__textPreview" aria-hidden>
                <p>Превью:</p>
                <div>
                    <Markdown input={text} />
                </div>
            </div>
        );
    }, []);

    const streamersOptions = useMemo(() => {
        const nullOption: SelectInputPropsType['options'][0] = {
            value: '',
            title: 'Неизвестно',
        };

        const options = StreamersData.map(streamerData => {
            const option: SelectInputPropsType['options'][0] = {
                value: streamerData.id,
                title: streamerData.user_name,
            };

            return option;
        });

        return [nullOption, ...options];
    }, [StreamersData]);

    return (
        <Formik initialValues={initialValues} onSubmit={submitHandler} validationSchema={CreateAirValidationSchema}>
            {({ isSubmitting, dirty, isValidating, isValid, values }) => {
                const isSubmitDisabled = IsCreateAirQueryPending || isSubmitting || isValidating || !isValid || !dirty;

                return (
                    <Form className="schedule__createAirForm">
                        <Field
                            name="text"
                            className="schedule__createAirForm__formItem"
                            label="Название эфира"
                            placeholder="Введите название эфира"
                            extra="Поддерживается разметка: **bold**, *курсив*, ~~зачёркнутый~~."
                            required
                            component={TextInput}
                        />

                        {renderMarkdownPreview(values.text)}

                        <Field
                            name="streamer_id"
                            className="schedule__createAirForm__formItem"
                            options={streamersOptions}
                            label="Стример"
                            required
                            component={SelectInput}
                        />

                        <Field
                            name="start_date"
                            className="schedule__createAirForm__formItem"
                            label="Дата начала эфира"
                            extra="Время должно быть московским."
                            required
                            component={DateTimeInput}
                        />

                        <Field
                            name="duration"
                            type="number"
                            className="schedule__createAirForm__formItem"
                            label="Продолжительность эфира (в минутах)"
                            required
                            component={TextInput}
                        />

                        <Field
                            name="link"
                            type="url"
                            className="schedule__createAirForm__formItem"
                            label="Ссылка"
                            placeholder="https://shikimori.org/animes/1639"
                            extra="Необязательно, но желательно."
                            component={TextInput}
                        />

                        <div className="schedule__createAirForm__submitBox">
                            <Button type="submit" disabled={isSubmitDisabled}>
                                Создать эфир
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default CreateAirForm;
