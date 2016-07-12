'use strict';

import * as http from 'http';
import * as express from 'express';

import ENVIRONMENT from '../config/environment';

import {ExpressPreset} from './express-preset';
import {MongoManager} from './mongo-manager';

const PORT: number = ENVIRONMENT.port || 9999;

/**
 * express 구동 전 사전 작업 클래스
 * 
 * @export
 * @class AppServer
 */
export class AppServer {
    private app: express.Application;
    private server: http.Server;
    private mongoManager: MongoManager;

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
        this.mongoManager = new MongoManager(this.app);
        new ExpressPreset(this.app);

        this.mongoManager.connect();

        // 서버 실행
        this.server = this.app.listen(PORT, () => {
            var host = this.server.address().address;
            var port = this.server.address().port;
            console.log('This express app is listening on port:' + port);
        });
    }

    /**
     * shutdown
     */
    public shutdown() {
        if (this.app) {
            this.app = undefined;
        }
        if (this.mongoManager) {
            this.mongoManager.disconnect();
            this.mongoManager = undefined;
        }
        if (this.server) {
            this.server.close();
            this.server = undefined;
        }
    }

    /**
     * 객체 정보 출력
     * 
     * @returns
     */
    toString() {
        return 'AppServer class';
    }
}
