'use strict';

import * as express from 'express';
import {ENVIRONMENT} from './config/environment';
import * as mongoose from 'mongoose';

import {
    LOGGING_MONGO_MANAGER
} from './config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_MONGO_MANAGER);

export class MongoManager {
    constructor(private app: express.Application, run: boolean = false) {
        if (!app) {
            throw (new Error('app is null or undefined.'));
        }
        if (run) {
            this.connect();
        }
    }

    /**
     * connect
     */
    public connect() {
        // the url correspond to the environment we are in
        this.app.set('dbUrl', ENVIRONMENT.db[this.app.settings.env]);
        // we're going to use mongoose to interact with the mongodb
        mongoose.connect(this.app.get('dbUrl'));
    }

    /**
     * disconnect
     */
    public disconnect() {
        mongoose.disconnect(e => { debug(e); });
    }

    toString() {
        return 'MongoManager class';
    }
}