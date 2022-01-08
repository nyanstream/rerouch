import { combineReducers } from '@reduxjs/toolkit';

import adminLoginReducer from '../components/AdminLogin/AdminLoginReduxSlice';

const rootReducer = combineReducers({
    adminLogin: adminLoginReducer,
});

type RootReducerType = typeof rootReducer;
export type RootStateType = ReturnType<RootReducerType>;

export default rootReducer;
