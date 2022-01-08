import ky from 'ky';

export const API = ky.create({
    prefixUrl: '/api',
    retry: { limit: 0 },
    credentials: 'include',
    hooks: {
        afterResponse: [
            (_request, _options, response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        //
                    }
                }
            },
        ],
    },
});
