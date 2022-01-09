import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AdminPanelUserManagementStateType } from './AdminPanelUserManagementTypes';

import { UserAPI } from '../../api/services';

export const ReducerName = 'adminPanelUserManagement';

export const changePasswordThunk = createAsyncThunk(`${ReducerName}/changePassword`, async (params: Parameters<typeof UserAPI.changePassword>[0]) => {
    const response = await UserAPI.changePassword(params);
    return response.status;
});

const InnitialState: AdminPanelUserManagementStateType = {
    IsChangePasswordQueryPending: false,
    ChangePasswordQueryResult: null,
};

const AdminPanelUserManagement = createSlice({
    name: ReducerName,
    initialState: InnitialState,
    reducers: {
        resetStateOnUnmount: (state, action: PayloadAction<void>) => {
            state.ChangePasswordQueryResult = null;
        },
    },
    extraReducers: builder => {
        builder.addCase(changePasswordThunk.pending, (state, action) => {
            state.IsChangePasswordQueryPending = true;
        });
        builder.addCase(changePasswordThunk.fulfilled, (state, action) => {
            state.IsChangePasswordQueryPending = false;
            state.ChangePasswordQueryResult = {
                timestamp: new Date().toISOString(),
                success: true,
            };
        });
        builder.addCase(changePasswordThunk.rejected, (state, action) => {
            state.IsChangePasswordQueryPending = false;
            state.ChangePasswordQueryResult = {
                timestamp: new Date().toISOString(),
                success: false,
            };
            console.warn(action.error);
        });
    },
});

export const { resetStateOnUnmount } = AdminPanelUserManagement.actions;

export default AdminPanelUserManagement.reducer;
