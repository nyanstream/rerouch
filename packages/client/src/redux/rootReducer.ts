import { combineReducers } from '@reduxjs/toolkit';

import adminLoginReducer from '../components/AdminLogin/AdminLoginReduxSlice';
import adminPanelUserManagementReducer from '../components/AdminPanelUserManagement/AdminPanelUserManagementReduxSlice';

const rootReducer = combineReducers({
    adminLogin: adminLoginReducer,
    adminPanelUserManagement: adminPanelUserManagementReducer,
});

type RootReducerType = typeof rootReducer;
export type RootStateType = ReturnType<RootReducerType>;

export default rootReducer;
