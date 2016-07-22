'use strict';

import {Request, Response} from 'express';

import config from '../../config/environment';
import {IServerModel} from './server.model';
import ServerBusiness from './server.business';
import * as cmmn from '../cmmn';

import requestUtil from '../../component/util/request.util';
import otherUtil from '../../component/util/other.util';
const nodeUtil = require('util');

/* test-code */
import {IS_DEBUG_ROUTE_SERVERS} from '../../debug/flag';
/* end-test-code */

import {DEBUG_ROUTE_SERVERS} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_ROUTE_SERVERS);

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
     * post 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    create(req: Request, res: Response): void {
        let server: IServerModel = req.body || {};

        debug(`try create`);
        debug(server);
        ServerBusiness
            .create(server)
            .then(r => {
                debug(`create succeed.`);
                debug(r);
                res.send(r);
            })
            .catch(cmmn.validationError(res));
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
        debug(`try destroy`);
        debug(req.params);
        ServerBusiness
            .findByIdAndRemove(req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })
            .catch(cmmn.handleError(res));
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
