import { API } from '../..';

import type { CurrentUserInfoQueryResponseType } from './types';
import type { ChangePasswordQueryParamsType } from './types';

const Controller = 'user';

export const UserAPI = {
    getCurrentUserInfo: async (): Promise<CurrentUserInfoQueryResponseType> => {
        return await API.get(`${Controller}/get-current-user-info`).json();
    },

    changePassword: async (params: ChangePasswordQueryParamsType): Promise<Response> => {
        return await API.patch(`${Controller}/change-password`, { json: params });
    },
};

export default UserAPI;
