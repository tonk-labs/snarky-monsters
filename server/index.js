const createServer = require('./server');

const PORT = process.env.PORT || 8080;
const HOST = '127.0.0.1';

const app = createServer();
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});