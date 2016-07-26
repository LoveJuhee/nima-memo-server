'use strict';

import {Request, Response} from 'express';

import config from '../../config/environment';
import {IServerModel} from './server.model';
import ServerBusiness from './server.business';
import {ApiController} from '../../component/api/controller';

/* test-code */
import {IS_DEBUG_ROUTE_SERVERS} from '../../debug/flag';
/* end-test-code */

import {DEBUG_ROUTE_SERVERS} from '../../config/logger';

/** 컨트롤러에 대한 객체 : request 처리는 this 가 없다. */
let instance: ServerController;

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
        instance = this;
        instance.debugger(`ServerController create`);
    }

    /**
     * get 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    index(req: Request, res: Response): void {
        let params = req.params || {};
        instance.debugger(`try index`);
        instance.debugger(params);

        ServerBusiness
            .findAll(params, '-__v')
            .then(r => {
                if (!r) {
                    instance.handleEntityNotFound(res);
                    return;
                }
                instance.respondWithResult(res)(r);
            })
            .catch(instance.handleError(res));
    }

    /**
     * post 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    create(req: Request, res: Response): void {
        let server: IServerModel = req.body || {};
        instance.debugger(`try create`);
        instance.debugger(server);

        ServerBusiness
            .create(server)
            .then(instance.respondWithResult(res))
            .catch(instance.validationError(res));
    }

    /**
     * get:id 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    show(req: Request, res: Response): void {
        let id: string = req.params.id;
        instance.debugger(`try show`);
        instance.debugger(id);

        ServerBusiness
            .findById(id, '-__v')
            .then(instance.respondWithResult(res))
            .catch(instance.handleEntityNotFound(res));
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
        instance.debugger(`try update`);
        instance.debugger(id);
        instance.debugger(body);

        ServerBusiness
            .updateById(id, body)
            .then(instance.respondWithResult(res))
            .catch(instance.handleError(res));
    }

    /**
     * delete 대응 로직
     * 
     * @param {Request} req
     * @param {Response} res
     */
    destroy(req: Request, res: Response): void {
        let id: string = req.params.id;
        instance.debugger(`try destroy`);
        instance.debugger(id);

        ServerBusiness
            .deleteById(req.params.id)
            .then(instance.respondWithResult(res))
            .catch(instance.handleError(res));
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
