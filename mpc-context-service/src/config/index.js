// mpc-context-service/src/config/index.js
require('dotenv').config({ path: '../../.env' }); // Load .env variables from root

const config = {
    port: process.env.MPC_SERVICE_PORT || process.env.PORT || 3000,
    // Add other configurations here, for example:
    // database: {
    //     host: process.env.DB_HOST,
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     name: process.env.DB_NAME,
    // },
    // externalApiService: {
    //     url: process.env.EXISTING_API_URL,
    //     apiKey: process.env.EXISTING_API_KEY,
    // }
};

module.exports = config;
