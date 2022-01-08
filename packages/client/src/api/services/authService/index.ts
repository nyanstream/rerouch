import { API } from '../..';

import type { LoginQueryParamsType } from './types';

const Controller = 'auth';

export const AuthAPI = {
    login: async (params: LoginQueryParamsType): Promise<Response> => {
        return await API.post(`${Controller}/login`, { json: params });
    },

    logout: async (): Promise<Response> => {
        return await API.post(`${Controller}/logout`);
    },

    checkAuth: async (): Promise<Response> => {
        return await API.head(`${Controller}/check`);
    },
};

export default AuthAPI;
