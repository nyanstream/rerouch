import { combineReducers } from '@reduxjs/toolkit';

import adminLoginReducer from '../components/AdminLogin/AdminLoginReduxSlice';
import adminPanelScheduleReducer from '../components/AdminPanelSchedule/AdminPanelScheduleReduxSlice';
import adminPanelUserManagementReducer from '../components/AdminPanelUserManagement/AdminPanelUserManagementReduxSlice';

const rootReducer = combineReducers({
    adminLogin: adminLoginReducer,
    adminPanelSchedule: adminPanelScheduleReducer,
    adminPanelUserManagement: adminPanelUserManagementReducer,
});

type RootReducerType = typeof rootReducer;
export type RootStateType = ReturnType<RootReducerType>;

export default rootReducer;
