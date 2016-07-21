'use strict';

import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import config from '../../config/environment';
import {IUserModel} from './user.model';
import UserBusiness from './user.business';
import * as cmmn from '../cmmn';

import requestUtil from '../../component/util/request.util';
import otherUtil from '../../component/util/other.util';
const nodeUtil = require('util');

/* test-code */
import {IS_DEBUG_ROUTE_USERS} from '../../debug/flag';
/* end-test-code */

import {DEBUG_ROUTE_USERS} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_ROUTE_USERS);

/**
 * 값 오류
 * 
 * @param {Response} res
 * @param {number} [statusCode=422]
 * @returns {Function}
 */
function validationError(res: Response, statusCode: number = 422): Function {
    return function (err: any) {
        res
            .status(statusCode)
            .json(err);
    };
}

/**
 * 핸들 오류
 * 
 * @param {Response} res
 * @param {number} [statusCode=500]
 * @returns {Function}
 */
function handleError(res: Response, statusCode: number = 500): Function {
    return function (err: any) {
        res
            .status(statusCode)
            .send(err);
    };
}

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
        UserBusiness
            .findAll({}, '-salt -password')
            .then(users => {
                res
                    .status(200)
                    .json(users);
            })
            .catch(handleError);
    }

    /**
     * post 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    create(req: Request, res: Response): void {
        let user: IUserModel = req.body || {};
        user.provider = 'local';
        user.role = 'user';

        UserBusiness
            .create(req.body)
            .then(r => {
                debug(`유저 계정 생성 성공`);
                var token = jwt.sign({
                    _id: user._id
                }, config.secrets.session, {
                        expiresIn: config.secrets.expiresIn
                    });
                res.json({ token });
            })
            .catch(validationError);
    }

    /**
     * get:id 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    show(req: Request, res: Response, next: NextFunction): void {
        var userId = req.params.id;
        UserBusiness
            .findById(userId)
            .then(user => {
                if (!user) {
                    return res
                        .status(404)
                        .end();
                }
                res.json(user.profile);
            })
            .catch(next);
    }

    /**
     * put, patch 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    update(req: Request, res: Response): void {
        if (req.body._id) {
            delete req.body._id;
        }
        UserBusiness
            .updateOne({ _id: req.params.id }, req.params)
            .then(cmmn.respondWithResult(res))
            .catch(cmmn.handleError(res));
    }

    /**
     * changePassword
     * 
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    changePassword(req: Request, res: Response, next: NextFunction) {
        var userId = req.user._id;
        var oldPass = String(req.body.oldPassword);
        var newPass = String(req.body.newPassword);

        UserBusiness
            .findById(userId)
            .then(user => {
                if (user.authenticate(oldPass)) {
                    user.password = newPass;
                    return user.save((err, r) => {
                        if (err) {
                            validationError(res);
                            return;
                        }
                        res
                            .status(204)
                            .end();
                    });
                } else {
                    return res
                        .status(403)
                        .end();
                }
            });
    }

    /**
     * delete 대응 로직
     *
     * @param {Request} req
     * @param {Response} res
     */
    destroy(req: Request, res: Response): void {
        UserBusiness
            .findByIdAndRemove(req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })
            .catch(handleError);
    }

    /**
     * me
     * 
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    me(req: Request, res: Response, next: NextFunction) {
        var _id = req.user._id;

        UserBusiness.findOne({ _id }, '-salt -password')
            .then(user => { // don't ever give out the password or salt
                if (!user) {
                    return res
                        .status(401)
                        .end();
                }
                res.json(user);
            })
            .catch(next);
    }

    /**
     * Authentication callback
     * 
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    authCallback(req: Request, res: Response, next: NextFunction) {
        res.redirect('/');
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