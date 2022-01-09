import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getScheduleThunk, getAirsCountThunk, getStreamersThunk } from '../AdminPanelScheduleReduxSlice';
import { resetStateOnUnmount } from '../AdminPanelScheduleReduxSlice';

import AdminPanelSchedule from './AdminPanelSchedule';

const AdminPanelScheduleContainer: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getScheduleThunk());
        dispatch(getAirsCountThunk());
        dispatch(getStreamersThunk());

        return () => {
            dispatch(resetStateOnUnmount());
        };
    }, [dispatch]);

    return <AdminPanelSchedule />;
};

export default AdminPanelScheduleContainer;
