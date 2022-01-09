import { createSelector } from '@reduxjs/toolkit';

import type { RootStateType } from '../../redux/rootReducer';

export const getStreamersData = createSelector(
    (state: RootStateType) => state.adminPanelSchedule.StreamersData,
    StreamersData => StreamersData
);

export const getIsCreateAirQueryPending = createSelector(
    (state: RootStateType) => state.adminPanelSchedule.IsCreateAirQueryPending,
    IsCreateAirQueryPending => IsCreateAirQueryPending
);

export const getCreateAirQueryResult = createSelector(
    (state: RootStateType) => state.adminPanelSchedule.CreateAirQueryResult,
    CreateAirQueryResult => CreateAirQueryResult
);
