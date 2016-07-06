'use strict';
require('source-map-support').install();

import * as express from 'express';
import {ExpressPreset} from './express-preset';

/**
 * express 구동 전 사전 작업 클래스
 * 
 * @export
 * @class Server
 */
export default class Server {
    app: express.Application;

    /**
     * Creates an instance of Routes.
     * 
     */
    constructor(run: boolean = false) {
        if (run) {
            this.startup();
        }
    }

    /**
     * startup
     */
    public startup() {
        if (this.app) {
            this.shutdown();
        }
        this.app = express();
        new ExpressPreset(this.app);
    }

    /**
     * shutdown
     */
    public shutdown() {
        this.app = undefined;
    }

    /**
     * 객체 정보 출력
     * 
     * @returns
     */
    toString() {
        return 'Server class';
    }
}
