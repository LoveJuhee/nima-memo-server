'use strict';

import {Request, Response} from 'express';

import config from '../../config/environment';
import {IServerModel} from './server.model';
import ServerBusiness from './server.business';
import {ApiController} from '../../component/api/controller';

import requestUtil from '../../component/util/request.util';
import otherUtil from '../../component/util/other.util';
const nodeUtil = require('util');

/* test-code */
import {IS_DEBUG_ROUTE_SERVERS} from '../../debug/flag';
/* end-test-code */

import {DEBUG_ROUTE_SERVERS} from '../../config/logger';

/**
 * rest server 에 대한 처리 클래스
 * 
 * @export
 * @class ServerController
 */
export class ServerController extends ApiController {
    /**
     * Creates an instance of ServerController.
     * 
     */
    constructor() {
        super(DEBUG_ROUTE_SERVERS);
        this.debugger(`ServerController create`);
    }

    /**
     * get 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    index(req: Request, res: Response): void {
        let params = req.params || {};
        this.debugger(`try index`);
        this.debugger(params);

        ServerBusiness
            .findAll(params, '-__v')
            .then(r => {
                if (!r) {
                    this.handleEntityNotFound(res);
                    return;
                }
                this.respondWithResult(res)(r);
            })
            .catch(this.handleError(res));
    }

    /**
     * post 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    create(req: Request, res: Response): void {
        let server: IServerModel = req.body || {};
        this.debugger(`try create`);
        this.debugger(server);

        ServerBusiness
            .create(server)
            .then(this.respondWithResult(res))
            .catch(this.validationError(res));
    }

    /**
     * get:id 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    show(req: Request, res: Response): void {
        let id: string = req.params.id;
        this.debugger(`try show`);
        this.debugger(id);

        ServerBusiness
            .findById(id, '-__v')
            .then(this.respondWithResult(res))
            .catch(this.handleEntityNotFound(res));
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
        this.debugger(`try update`);
        this.debugger(id);
        this.debugger(body);

        ServerBusiness
            .updateById(id, body)
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }

    /**
     * delete 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    destroy(req: Request, res: Response): void {
        let id: string = req.params.id;
        this.debugger(`try destroy`);
        this.debugger(id);

        ServerBusiness
            .deleteById(req.params.id)
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
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
