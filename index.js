import express from 'express';
import bodyParser from 'body-parser';
import { createReadStream } from 'fs';
import http from 'http';
import crypto from 'crypto';
import pug from 'pug';
import appSrc from './app.js';

const app = appSrc(express, bodyParser, createReadStream, crypto, http, pug);

app.listen(process.env.PORT || 3000);