export default function (express, bodyParser, createReadStream, crypto, http) {
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
        const filePath = import.meta.url.substring(7);
        createReadStream(filePath).pipe(res);
    });

    app.get('/sha1/:input/', (req, res) => {
        const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
        res.send(hash);
    });

    app.get('/req/', (req, res) => {
        const addr = req.query.addr;
        if (!addr) return res.status(400).send('Address is required');

        http.get(addr, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => { res.send(data); });
        }).on("error", (err) => { res.status(500).send(err.message); });
    });

    app.post('/req/', bodyParser.text(), (req, res) => {
        const addr = req.body;
        if (!addr) return res.status(400).send('Address is required');
        http.get(addr, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => { res.send(data); });
        }).on("error", (err) => { res.status(500).send(err.message); });
    });

    app.all('*', (req, res) => {
        res.send('nukutontarog');
    });

    return app;
}