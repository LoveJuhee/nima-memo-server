'use strict';

export const ENVIRONMENT = {
    db: {
        production: process.env.NIMA_KITV_DB_URI,
        development: 'mongodb://127.0.0.1/nima-kitv-server-dev',
        test: 'mongodb://127.0.0.1/nima-kitv-server-test',
    },
    port: process.env.NIMA_KITV_WEB_PORT || 9700,
};
