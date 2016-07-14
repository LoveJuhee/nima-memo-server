'use strict';

/* test-code */
import {IS_DEBUG_ROUTE_SERVER} from '../../debug/flag';
/* end-test-code */

import {DEBUG_ROUTE_SERVER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_ROUTE_SERVER);

import requestUtil from '../../util/request-util';
import otherUtil from '../../util/other-util';
const nodeUtil = require('util');

import {Request, Response} from 'express';

/**
 * rest server 에 대한 처리 클래스
 * 
 * @export
 * @class ServerController
 */
export class ServerController {
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
     * @param {Request} req
     * @param {Response} res
     */
    index(req: Request, res: Response): void {
        let params = req.params;
        debug(`index ${nodeUtil.inspect(params)}`);
        res.send('index');
    }

    /**
     * get:id 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    show(req: Request, res: Response): void {
        debug(`params: ${nodeUtil.inspect(req.params)}`);
        requestUtil.fromRequestParams(req.params)
            .then(otherUtil.print)
            .then(r => {
                res.send(`show ${nodeUtil.inspect(r)}`);
            });
    }

    /**
     * post 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    create(req: Request, res: Response): void {
        let body = req.body;
        debug(`create ${nodeUtil.inspect(body)}`);
        res.send(`create ${nodeUtil.inspect(body)}`);
    }

    /**
     * put, patch 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    update(req: Request, res: Response): void {
        let params = requestUtil.toEncodeObject(req.params);
        debug(`update ${nodeUtil.inspect(params)}`);
        res.send('update');
    }

    /**
     * delete 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    destroy(req: Request, res: Response): void {
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
