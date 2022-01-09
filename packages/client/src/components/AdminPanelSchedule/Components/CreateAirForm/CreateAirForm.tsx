import { useRef, useCallback, useMemo } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';

import type { StreamersQueryResponseType } from '../../../../api/services/userService/types';
import type { CreateAirQueryParamsType } from '../../../../api/services/scheduleService/types';

import { CreateAirValidationSchema } from '../../logic/validationSchemas';

import { Markdown, TextInput, SelectInput, Button, Link } from '../../../common';
import type { SelectInputPropsType } from '../../../common';

import './CreateAirForm.scss';

type PropsType = {
    StreamersData: StreamersQueryResponseType;
    IsCreateAirQueryPending: boolean;
    handleNewAirData: (data: CreateAirQueryParamsType) => void;
};

const CreateAirForm: React.FC<PropsType> = props => {
    const { StreamersData, IsCreateAirQueryPending } = props;
    const { handleNewAirData } = props;

    const initialValues = useRef<CreateAirQueryParamsType>({
        text: '',
        streamerId: StreamersData[0].id,
        startDate: '',
        endDate: '',
        hidden: false,
    });

    const submitHandler = useCallback(async (values: CreateAirQueryParamsType, helpers: FormikHelpers<CreateAirQueryParamsType>) => {
        console.log(values);
        // handleNewPassword(values);
    }, []);

    const renderMarkdownPreview = useCallback((text: string) => {
        if (!text) {
            return null;
        }

        return (
            <div className="schedule__createAirForm__textPreview" aria-hidden>
                <p>Превью:</p>
                <div>
                    <Markdown>{text}</Markdown>
                </div>
            </div>
        );
    }, []);

    const streamersOptions = useMemo(() => {
        return StreamersData.map(streamerData => {
            const option: SelectInputPropsType['options'][0] = {
                value: streamerData.id,
                title: streamerData.username,
            };

            return option;
        });
    }, [StreamersData]);

    return (
        <Formik initialValues={initialValues.current} onSubmit={submitHandler} validationSchema={CreateAirValidationSchema}>
            {({ isSubmitting, dirty, isValidating, isValid, values }) => {
                const isSubmitDisabled = IsCreateAirQueryPending || isSubmitting || isValidating || !isValid || !dirty;

                return (
                    <Form className="schedule__createAirForm">
                        <Field
                            name="text"
                            className="schedule__createAirForm__formItem"
                            label="Название эфира"
                            placeholder="Введите название эфира"
                            extra={
                                <>
                                    Поддерживается базовый <Link href="https://guides.hexlet.io/markdown/">Markdown</Link>.
                                </>
                            }
                            required
                            component={TextInput}
                        />

                        {renderMarkdownPreview(values.text)}

                        <Field
                            name="streamerId"
                            className="schedule__createAirForm__formItem"
                            options={streamersOptions}
                            label="Стример"
                            required
                            component={SelectInput}
                        />

                        <Field
                            name="startDate"
                            className="schedule__createAirForm__formItem"
                            label="Дата начала эфира"
                            required
                            component={TextInput}
                        />

                        <Field
                            name="startDate"
                            className="schedule__createAirForm__formItem"
                            label="Дата окончания эфира"
                            required
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
