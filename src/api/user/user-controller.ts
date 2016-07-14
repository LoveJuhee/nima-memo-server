'use strict';

/* test-code */
import {IS_DEBUG_ROUTE_USERS} from '../../debug/flag';
/* end-test-code */

import {DEBUG_ROUTE_USERS} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_ROUTE_USERS);

import requestUtil from '../../util/request-util';
import otherUtil from '../../util/other-util';
const nodeUtil = require('util');

import factory from '../../business/user/user-business';

import {Request, Response} from 'express';

/**
 * rest 라우트명 에 대한 처리 클래스
 *
 * @export
 * @class UserController
 */
export class UserController {
    /**
     * Creates an instance of UserController.
     *
     */
    constructor() {
        debug(`UserController create`);
    }

    /**
     * get 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    index(req: Request, res: Response): void {
        res.send('UserController.index');
    }

    /**
     * get:id 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    show(req: Request, res: Response): void {
        res.send('UserController.show');
    }

    /**
     * post 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    create(req: Request, res: Response): void {
        factory.create(req.body)
            .then(r => {
                debug(`유저 계정 생성 성공`);
                res.send(r);
            })
            .catch(err => {
                debug(`factory.create failed`);
                debug(err);
                let e: Error = err;
                res.send(e.message);
            });
    }

    /**
     * put, patch 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    update(req: Request, res: Response): void {
        res.send('UserController.update');
    }

    /**
     * delete 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    destroy(req: Request, res: Response): void {
        res.send('UserController.destroy');
    }

    /**
     * 객체 정보
     *
     * @returns {string}
     */
    toString(): string {
        return 'UserController class';
    }
}