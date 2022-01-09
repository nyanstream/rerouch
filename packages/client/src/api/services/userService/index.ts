import { API } from '../..';

import type { CurrentUserInfoQueryResponseType } from './types';
import type { ChangePasswordQueryParamsType } from './types';
import type { RolesQueryResponseType } from './types';
import type { StreamersQueryResponseType } from './types';

const Controller = 'user';

export const UserAPI = {
    getCurrentUserInfo: async (): Promise<CurrentUserInfoQueryResponseType> => {
        return await API.get(`${Controller}/get-current-user-info`).json();
    },

    changePassword: async (params: ChangePasswordQueryParamsType): Promise<Response> => {
        return await API.patch(`${Controller}/change-password`, { json: params });
    },

    getRoles: async (): Promise<RolesQueryResponseType> => {
        return await API.get(`${Controller}/get-roles`).json();
    },

    getStreamers: async (): Promise<StreamersQueryResponseType> => {
        return await API.get(`${Controller}/get-streamers`).json();
    },
};

export default UserAPI;
