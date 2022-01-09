import { createSelector } from '@reduxjs/toolkit';

import type { RootStateType } from '../../redux/rootReducer';

export const getIsChangePasswordQueryPending = createSelector(
    (state: RootStateType) => state.adminPanelUserManagement.IsChangePasswordQueryPending,
    IsChangePasswordQueryPending => IsChangePasswordQueryPending
);

export const getChangePasswordQueryResult = createSelector(
    (state: RootStateType) => state.adminPanelUserManagement.ChangePasswordQueryResult,
    ChangePasswordQueryResult => ChangePasswordQueryResult
);
