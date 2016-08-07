'use strict';

import {Request, Response} from 'express';

import config from '../../config/environment';
import {IMemoModel} from './memo.model';
import MemoBusiness from './memo.business';
import {ApiController} from '../../component/api/controller';

import {DEBUG_ROUTE_MEMOS} from '../../config/logger';

/** 컨트롤러에 대한 객체 : request 처리는 this 가 없다. */
let instance: MemoController;

/**
 * rest memo 에 대한 처리 클래스
 * 
 * @export
 * @class MemoController
 */
export class MemoController extends ApiController {
    /**
     * Creates an instance of MemoController.
     * 
     */
    constructor() {
        super(DEBUG_ROUTE_MEMOS);
        instance = this;
        instance.debugger(`MemoController create`);
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

        MemoBusiness
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
        let memo: IMemoModel = req.body || {};
        instance.debugger(`try create`);
        instance.debugger(memo);

        MemoBusiness
            .create(memo)
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

        MemoBusiness
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

        MemoBusiness
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

        MemoBusiness
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
        return 'MemoController class';
    }
}
