import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    devTools: !import.meta.env.PROD,
});

export default store;
