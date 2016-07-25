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
        let params = req.params || {};
        debug(`try index`);
        debug(params);

        ServerBusiness
            .findAll(params, '-__v')
            .then(r => {
                if (!r) {
                    cmmn.handleEntityNotFound(res);
                    return;
                }
                cmmn.respondWithResult(res)(r);
            })
            .catch(cmmn.handleError(res));
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
                if (!r) {
                    cmmn.handleEntityNotFound(res);
                    return;
                }
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
        let id: string = req.params.id;
        debug(`try show`);
        debug(id);

        ServerBusiness
            .findById(id, '-__v')
            .then(r => {
                if (!r) {
                    cmmn.handleEntityNotFound(res);
                    return;
                }
                cmmn.respondWithResult(res)(r);
            })
            .catch(cmmn.handleEntityNotFound(res));
    }

    /**
     * put, patch 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    update(req: Request, res: Response): void {
        let id: string = req.params.id;
        let body: any = req.body;
        debug(`try update`);
        debug(id);
        debug(body);

        ServerBusiness
            .updateById(id, body)
            .then(r => {
                if (!r) {
                    cmmn.handleEntityNotFound(res);
                    return;
                }
                cmmn.respondWithResult(res)();
            })
            .catch(cmmn.handleError(res));
    }

    /**
     * delete 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    destroy(req: Request, res: Response): void {
        let id: string = req.params.id;
        debug(`try destroy`);
        debug(id);

        ServerBusiness
            .deleteById(req.params.id)
            .then(r => {
                if (!r) {
                    debug(`deleteById result is null`);
                    cmmn.handleEntityNotFound(res)();
                    return;
                }
                cmmn.respondWithResult(res, 204)();
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
