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

export const getIsLogihError = createSelector(
    (state: RootStateType) => state.adminLogin.IsLogihError,
    IsLogihError => IsLogihError
);

export const getIsLoginCheckComplete = createSelector(
    (state: RootStateType) => state.adminLogin.IsLoginCheckComplete,
    IsLoginCheckComplete => IsLoginCheckComplete
);
