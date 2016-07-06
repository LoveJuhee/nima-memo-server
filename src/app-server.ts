'use strict';

import * as http from 'http';
import * as express from 'express';
import {ExpressPreset} from './express-preset';

const PORT: number = 8080;

/**
 * express 구동 전 사전 작업 클래스
 * 
 * @export
 * @class AppServer
 */
export default class AppServer {
    app: express.Application;
    server: http.Server;

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

        // 서버 실행
        this.server = this.app.listen(PORT, () => {
            var host = this.server.address().address;
            var port = this.server.address().port;
            console.log('This express app is listening on port:' + port);
        });
        // this.server = http.createServer(this.app).listen(PORT, function () {
        //     console.log(`AppServer start. port: ${PORT}`);
        // });
    }

    /**
     * shutdown
     */
    public shutdown() {
        this.app = undefined;
        this.server.close();
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
