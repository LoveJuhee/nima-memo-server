/// <reference path='../../typings/index.d.ts' />
require('source-map-support').install();

// jasmine 테스트를 위한 프리셋
import * as express from 'express';
let app = express();

import {MongoManager} from '../preset/mongo-manager';
let db = new MongoManager(app, false);

process.env.NODE_ENV = 'test';

export let preset = { app, db };