import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { CreateAirQueryParamsType } from '../../../../api/services/scheduleService/types';

import { getStreamersData } from '../../AdminPanelScheduleReduxSelectors';
import { getIsCreateAirQueryPending, getCreateAirQueryResult } from '../../AdminPanelScheduleReduxSelectors';

import { createAirThunk } from '../../AdminPanelScheduleReduxSlice';

import CreateAirForm from './CreateAirForm';

const CreateAirFormContainer: React.FC = () => {
    const StreamersData = useSelector(getStreamersData);
    const IsCreateAirQueryPending = useSelector(getIsCreateAirQueryPending);
    const CreateAirQueryResult = useSelector(getCreateAirQueryResult);

    const dispatch = useDispatch();

    useEffect(() => {
        if (CreateAirQueryResult) {
            const { success } = CreateAirQueryResult;

            const content = success ? 'Эфир создан' : 'Ошибка!';
            const type = success ? 'success' : 'error';

            //
        }
    }, [CreateAirQueryResult]);

    const handleNewAirData = useCallback(
        (params: CreateAirQueryParamsType) => {
            dispatch(createAirThunk(params));
        },
        [dispatch]
    );

    if (!StreamersData) {
        return null;
    }

    return <CreateAirForm {...{ StreamersData, IsCreateAirQueryPending }} {...{ handleNewAirData }} />;
};

export default CreateAirFormContainer;
