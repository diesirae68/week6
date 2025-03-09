export default function (express, bodyParser, createReadStream, crypto, http, https) {
    const app = express();

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type, x-author, ngrok-skip-browser-warning');
        next();
    });

    app.get('/login/', (req, res) => {
        res.send('nukutontarog');
    });

    app.get('/code/', (req, res) => {
        const filePath = import.meta.url.substring(8);
        createReadStream(filePath).pipe(res);
    });

    app.get('/test/', (req, res) => {
        const addr = req.query.querystring || req.query.URL || req.query.addr;
        if (!addr) return res.status(400).send('Address is required');

        https.get(addr, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                const match = data.match(/onclick="this\.previousSibling\.value='([^']+)'"/);
                const num = match ? match[1] : '';
                res.header('Content-Type', 'text/plain');
                res.send(num);
            });
        }).on("error", (err) => { res.status(500).send(err.message); });
    });

    app.all('*', (req, res) => {
        res.send('nukutontarog');
    });

    return app;
}