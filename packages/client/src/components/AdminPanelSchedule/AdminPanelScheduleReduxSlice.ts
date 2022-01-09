import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AdminPanelScheduleStateType } from './AdminPanelScheduleTypes';

import { ScheduleAPI, UserAPI } from '../../api/services';

export const ReducerName = 'adminPanelSchedule';

export const getScheduleThunk = createAsyncThunk(`${ReducerName}/getSchedule`, async (params: Parameters<typeof ScheduleAPI.getSchedule>[0]) => {
    const response = await ScheduleAPI.getSchedule(params);
    return response;
});

export const getAirsCountThunk = createAsyncThunk(`${ReducerName}/getAirsCount`, async () => {
    const response = await ScheduleAPI.getAirsCount();
    return response.count;
});

export const getStreamersThunk = createAsyncThunk(`${ReducerName}/getStreamers`, async () => {
    const response = await UserAPI.getStreamers();
    return response;
});

export const createAirThunk = createAsyncThunk(`${ReducerName}/createAir`, async (params: Parameters<typeof ScheduleAPI.createAir>[0]) => {
    const response = await ScheduleAPI.createAir(params);
    return response;
});

export const editAirThunk = createAsyncThunk(`${ReducerName}/editAir`, async (params: Parameters<typeof ScheduleAPI.editAir>[0]) => {
    const response = await ScheduleAPI.editAir(params);
    return response;
});

const InnitialState: AdminPanelScheduleStateType = {
    StreamersData: null,
    IsStreamersDataPending: false,
    ScheduleData: null,
    IsScheduleDataPending: false,
    ScheduleAirsCount: null,
    IsScheduleAirsCountPending: false,
    CreateAirQueryResult: null,
    IsCreateAirQueryPending: false,
};

const AdminPanelSchedule = createSlice({
    name: ReducerName,
    initialState: InnitialState,
    reducers: {
        resetStateOnUnmount: (state, action: PayloadAction<void>) => {
            state.StreamersData = null;
            state.ScheduleData = null;
            state.ScheduleAirsCount = null;
        },
    },
    extraReducers: builder => {
        builder.addCase(getStreamersThunk.pending, (state, action) => {
            state.IsStreamersDataPending = true;
        });
        builder.addCase(getStreamersThunk.fulfilled, (state, action) => {
            state.IsStreamersDataPending = false;
            state.StreamersData = action.payload;
        });
        builder.addCase(getStreamersThunk.rejected, (state, action) => {
            state.IsStreamersDataPending = false;
            console.warn(action.error);
        });

        builder.addCase(getScheduleThunk.pending, (state, action) => {
            state.IsScheduleDataPending = true;
        });
        builder.addCase(getScheduleThunk.fulfilled, (state, action) => {
            state.IsScheduleDataPending = false;
            state.ScheduleData = action.payload;
        });
        builder.addCase(getScheduleThunk.rejected, (state, action) => {
            state.IsScheduleDataPending = false;
            console.warn(action.error);
        });

        builder.addCase(getAirsCountThunk.pending, (state, action) => {
            state.IsScheduleAirsCountPending = true;
        });
        builder.addCase(getAirsCountThunk.fulfilled, (state, action) => {
            state.IsScheduleAirsCountPending = false;
            state.ScheduleAirsCount = action.payload;
        });
        builder.addCase(getAirsCountThunk.rejected, (state, action) => {
            state.IsScheduleAirsCountPending = false;
            console.warn(action.error);
        });

        builder.addCase(createAirThunk.pending, (state, action) => {
            state.IsCreateAirQueryPending = true;
        });
        builder.addCase(createAirThunk.fulfilled, (state, action) => {
            state.IsCreateAirQueryPending = false;
            state.CreateAirQueryResult = {
                timestamp: new Date().toISOString(),
                success: true,
            };
        });
        builder.addCase(createAirThunk.rejected, (state, action) => {
            state.IsCreateAirQueryPending = false;
            state.CreateAirQueryResult = {
                timestamp: new Date().toISOString(),
                success: false,
            };
            console.warn(action.error);
        });
    },
});

export const { resetStateOnUnmount } = AdminPanelSchedule.actions;

export default AdminPanelSchedule.reducer;
