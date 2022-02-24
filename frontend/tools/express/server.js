/*eslint-disable import/default*/
/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import open from 'opn';
import fs from 'fs';
import https from 'https';

import compression from 'compression';

const port = 3000;
const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, '../../build')));
app.get('*.js', function (req, res, next) {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../../build/index.html'));
});

const key = fs.readFileSync('tools/express/ssl/cert.key');
const cert = fs.readFileSync('tools/express/ssl/cert.pem');
const server = https.createServer({ key: key, cert: cert }, app);

server.listen(port, function (err) {
	if (err) {
		console.log(err);
	} else {
		open(`https://localhost:${port}`);
	}
});
