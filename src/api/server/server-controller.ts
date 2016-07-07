'use strict';

/* test-code */
import {
    IS_DEBUG_ROUTE_SERVER,
} from '../../debug/flag';
/* end-test-code */

import {
    LOGGING_API_SERVER,
} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_API_SERVER);

import {
    default as requestUtil
} from '../../util/request-util';
const nodeUtil = require('util');

import * as express from 'express';

/**
 * rest server 에 대한 처리 클래스
 * 
 * @export
 * @class ServerController
 */
export default class ServerController {
    /**
     * Creates an instance of ServerController.
     * 
     */
    constructor() {
        debug(`ServerController create`);
    }

    /**
     * get 대응 로직
     * 
     * @param {express.Request} req
     * @param {express.Response} res
     */
    index(req: express.Request, res: express.Response): void {
        let params = req.params;
        debug(`index ${nodeUtil.inspect(params)}`);
        res.send('index');
    }

    /**
     * get:id 대응 로직
     * 
     * @param {express.Request} req
     * @param {express.Response} res
     */
    show(req: express.Request, res: express.Response): void {
        debug(`params: ${nodeUtil.inspect(req.params)}`);
        requestUtil.fromRequestParams(req.params)
            .then(requestUtil.print)
            .then(r => {
                res.send(`show ${nodeUtil.inspect(r)}`);
            });
    }

    /**
     * post 대응 로직
     * 
     * @param {express.Request} req
     * @param {express.Response} res
     */
    create(req: express.Request, res: express.Response): void {
        let body = req.body;
        debug(`create ${nodeUtil.inspect(body)}`);
        res.send(`create ${nodeUtil.inspect(body)}`);
    }

    /**
     * put, patch 대응 로직
     * 
     * @param {express.Request} req
     * @param {express.Response} res
     */
    update(req: express.Request, res: express.Response): void {
        let params = requestUtil.toEncodeObject(req.params);
        debug(`update ${nodeUtil.inspect(params)}`);
        res.send('update');
    }

    /**
     * delete 대응 로직
     * 
     * @param {express.Request} req
     * @param {express.Response} res
     */
    destroy(req: express.Request, res: express.Response): void {
        let params = requestUtil.toEncodeObject(req.params);
        debug(`destroy ${nodeUtil.inspect(params)}`);
        res.send('destroy');
    }

    /**
     * 객체 정보
     * 
     * @returns {string}
     */
    toString(): string {
        return 'ServerController class';
    }
}
