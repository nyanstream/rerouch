declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_IP?: string;
            APP_PORT?: string;
            DB_CONNECTION_STRING?: string;

            API_RECAPTCHA_SERVER_KEY?: string;

            PASSWORD_SALT?: string;
        }
    }
}

export {};
