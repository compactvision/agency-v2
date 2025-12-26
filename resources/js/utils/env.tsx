export const appEnv = {
    name: import.meta.env.VITE_APP_NAME || 'DRC Agency',
    url: import.meta.env.VITE_APP_URL || window.location.origin,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
};
