// mpc-context-service/server.js
const app = require('./src/app');
const config = require('./src/config');

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`MPC Context Service listening on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
    console.log(`API base route: http://localhost:${PORT}/api/context`);
});
