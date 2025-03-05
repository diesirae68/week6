export default function (express, bodyParser, createReadStream, crypto, http, MongoClient) {
    const app = express();

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type, x-author, ngrok-skip-browser-warning');
        next();
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));

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

    app.post('/insert/', (req, res) => {
        const login = req.body.login;
        if (!login) return res.status(400).send('Login is required');
        const password = req.body.password;
        if (!password) return res.status(400).send('Password is required');
        const URL = req.body.URL;
        if (!URL) return res.status(400).send('URL is required');
        const client = new MongoClient(URL);
        (async () => {
            try {
                await client.connect();
                const users = await client.db().collection('users');
                const result = await users.insertOne({login: login, password: password});
                const { insertedId } = result;
                await client.close();
                res.send(insertedId);
            } catch (e) {
                res.status(500).send('MongoDB error');
            }
        })();
    });

    app.all('*', (req, res) => {
        res.send('nukutontarog');
    });

    return app;
}