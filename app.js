export default function (express, bodyParser, createReadStream, crypto, http, https, pug) {
    const app = express();

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type, x-author, ngrok-skip-browser-warning');
        next();
    });

	app.use(bodyParser.json());

    app.get('/login/', (req, res) => {
        res.send('nukutontarog');
    });

    app.get('/code/', (req, res) => {
        const filePath = import.meta.url.substring(8);
        createReadStream(filePath).pipe(res);
    });

    app.get('/wordpress/wp-json/wp/v2/posts/1', (req, res) => {
        https.get('https://phpmage.ru/projects/wordpress/wp-json/wp/v2/posts/1', (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                data = JSON.parse(data);
                res.header('Content-Type', 'application/json');
                res.send(JSON.stringify({title: data.title}));
            });
        }).on("error", (err) => { res.status(500).send(err.message); });
    });

    app.post('/render/', (req, res) => {
        const random2 = req.body.random2;
        if (!random2) return res.status(400).send('random2 is required');
        const random3 = req.body.random3;
        if (!random3) return res.status(400).send('random3 is required');
        const addr = req.query.addr;
        if (!addr) return res.status(400).send('Address is required');

        http.get(addr, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                res.send(pug.render(data, {random2: random2, random3: random3}));
            });
        }).on("error", (err) => { res.status(500).send(err.message); });
    });

    app.all('*', (req, res) => {
        res.send('nukutontarog');
    });

    return app;
}