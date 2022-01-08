import { createSelector } from '@reduxjs/toolkit';

import type { RootStateType } from '../../redux/rootReducer';

export const getIsUserLoggedIn = createSelector(
    (state: RootStateType) => state.adminLogin.IsUserLoggedIn,
    IsUserLoggedIn => IsUserLoggedIn
);

export const getIsLoginPending = createSelector(
    (state: RootStateType) => state.adminLogin.IsLoginPending,
    IsLoginPending => IsLoginPending
);

export const getIsLoginError = createSelector(
    (state: RootStateType) => state.adminLogin.IsLoginError,
    IsLoginError => IsLoginError
);

export const getIsLoginCheckComplete = createSelector(
    (state: RootStateType) => state.adminLogin.IsLoginCheckComplete,
    IsLoginCheckComplete => IsLoginCheckComplete
);

export const getIsUserInfoPending = createSelector(
    (state: RootStateType) => state.adminLogin.IsUserInfoPending,
    IsUserInfoPending => IsUserInfoPending
);

export const getUserInfo = createSelector(
    (state: RootStateType) => state.adminLogin.UserInfo,
    UserInfo => UserInfo
);
