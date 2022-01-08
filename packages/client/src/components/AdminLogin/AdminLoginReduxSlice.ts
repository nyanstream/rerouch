import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AdminLoginStateType } from './AdminLoginTypes';

import AuthAPI from '../../api/services/authService';

export const ReducerName = 'adminLogin';

const { login, checkAuth } = AuthAPI;

export const loginThunk = createAsyncThunk(`${ReducerName}/login`, async (params: Parameters<typeof login>[0]) => {
    const response = await login(params);
    return response.status;
});

export const checkAuthThunk = createAsyncThunk(`${ReducerName}/checkAuth`, async () => {
    const response = await checkAuth();
    return response.status;
});

const InnitialState: AdminLoginStateType = {
    IsUserLoggedIn: false,
    IsLoginPending: false,
    IsLogihError: false,
    IsLoginCheckComplete: false,
};

const AdminLoginSlice = createSlice({
    name: ReducerName,
    initialState: InnitialState,
    reducers: {
        resetLoginError: (state, action: PayloadAction<void>) => {
            state.IsLogihError = false;
        },
    },
    extraReducers: builder => {
        builder.addCase(loginThunk.pending, (state, action) => {
            state.IsLoginPending = true;
        });
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            state.IsUserLoggedIn = true;
            state.IsLogihError = false;
            state.IsLoginPending = false;
        });
        builder.addCase(loginThunk.rejected, (state, action) => {
            state.IsUserLoggedIn = false;
            state.IsLogihError = true;
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
    },
});

export const { resetLoginError } = AdminLoginSlice.actions;

export default AdminLoginSlice.reducer;
