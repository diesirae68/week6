import express from 'express';
import bodyParser from 'body-parser';
import { createReadStream } from 'fs';
import http from 'http';
import crypto from 'crypto';
import appSrc from './app.js';
import mongodb from 'mongodb';

const app = appSrc(express, bodyParser, createReadStream, crypto, http, mongodb.MongoClient);

app.listen(process.env.PORT || 3000);