import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AdminLoginStateType } from './AdminLoginTypes';

import { AuthAPI, UserAPI } from '../../api/services';

export const ReducerName = 'adminLogin';

export const loginThunk = createAsyncThunk(`${ReducerName}/login`, async (params: Parameters<typeof AuthAPI.login>[0]) => {
    const response = await AuthAPI.login(params);
    return response.status;
});

export const logoutThunk = createAsyncThunk(`${ReducerName}/logout`, async () => {
    const response = await AuthAPI.logout();
    return response.status;
});

export const checkAuthThunk = createAsyncThunk(`${ReducerName}/checkAuth`, async () => {
    const response = await AuthAPI.checkAuth();
    return response.status;
});

export const getCurrentUserInfoThunk = createAsyncThunk(`${ReducerName}/getCurrentUserInfo`, async () => {
    const response = await UserAPI.getCurrentUserInfo();
    return response;
});

const InnitialState: AdminLoginStateType = {
    IsUserLoggedIn: false,
    IsLoginPending: false,
    IsLoginError: false,
    IsLoginCheckComplete: false,
    IsUserInfoPending: false,
    UserInfo: null,
};

const AdminLoginSlice = createSlice({
    name: ReducerName,
    initialState: InnitialState,
    reducers: {
        resetLoginError: (state, action: PayloadAction<void>) => {
            state.IsLoginError = false;
        },
    },
    extraReducers: builder => {
        builder.addCase(loginThunk.pending, (state, action) => {
            state.IsLoginPending = true;
        });
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            state.IsUserLoggedIn = true;
            state.IsLoginError = false;
            state.IsLoginPending = false;
        });
        builder.addCase(loginThunk.rejected, (state, action) => {
            state.IsUserLoggedIn = false;
            state.IsLoginError = true;
            state.IsLoginPending = false;
        });

        builder.addCase(logoutThunk.pending, (state, action) => {
            state.IsLoginPending = true;
        });
        builder.addCase(logoutThunk.fulfilled, (state, action) => {
            state.IsUserLoggedIn = false;
            state.IsLoginError = false;
            state.IsLoginPending = false;
            state.UserInfo = null;
        });
        builder.addCase(logoutThunk.rejected, (state, action) => {
            state.IsLoginPending = false;
        });

        builder.addCase(checkAuthThunk.pending, (state, action) => {
            state.IsLoginCheckComplete = false;
        });
        builder.addCase(checkAuthThunk.fulfilled, (state, action) => {
            state.IsUserLoggedIn = true;
            state.IsLoginCheckComplete = true;
        });
        builder.addCase(checkAuthThunk.rejected, (state, action) => {
            state.IsUserLoggedIn = false;
            state.IsLoginCheckComplete = true;
        });

        builder.addCase(getCurrentUserInfoThunk.pending, (state, action) => {
            state.IsUserInfoPending = true;
        });
        builder.addCase(getCurrentUserInfoThunk.fulfilled, (state, action) => {
            state.IsUserInfoPending = false;
            state.UserInfo = action.payload;
        });
        builder.addCase(getCurrentUserInfoThunk.rejected, (state, action) => {
            state.IsUserInfoPending = false;
            console.warn(action.error);
        });
    },
});

export const { resetLoginError } = AdminLoginSlice.actions;

export default AdminLoginSlice.reducer;
