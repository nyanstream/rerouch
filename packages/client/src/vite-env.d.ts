/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_RECAPTCHA_CLIENT_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
