'use strict';

import * as express from 'express';
import {ENVIRONMENT} from '../config/environment';
import * as mongoose from 'mongoose';

import {
    LOGGING_MONGO_MANAGER
} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_MONGO_MANAGER);

/**
 * MongoDB 접속 관리자
 * 
 * @export
 * @class MongoManager
 */
export class MongoManager {
    private _mongoose: mongoose.Mongoose;
    /**
     * Creates an instance of MongoManager.
     * 
     * @param {express.Application} app
     * @param {boolean} [run=false]
     */
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
        this._mongoose = mongoose.connect(this.app.get('dbUrl'));
    }

    /**
     * DB 접속 여부 
     * 
     * @readonly
     * @type {boolean}
     */
    public get isConnected(): boolean {
        if (this._mongoose) {
            return (this._mongoose.connection.readyState === 1);
        }
        return false;
    }

    /**
     * DB 접속 상태
     * 
     * @readonly
     * @type {number}
     */
    public get readyState(): number {
        return (this._mongoose) ? this._mongoose.connection.readyState : -1;
    }

    /**
     * disconnect
     */
    public disconnect() {
        mongoose.disconnect(e => { debug(e); });
    }

    /**
     * 객체 정보 반환
     * 
     * @returns
     */
    toString() {
        return 'MongoManager class';
    }
}