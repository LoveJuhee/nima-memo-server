'use strict';

import {Router, Request, Response, NextFunction} from 'express';
import * as passport from 'passport';

import * as auth from '../auth.service';
import {IUserModel} from '../../api/user/user.model';
import {UserBusiness} from '../../api/user/user.business';
import {Environment} from '../../config/environment/params';

import {LocalPassport} from './passport';

import {DEBUG_AUTH_LOCAL} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_AUTH_LOCAL);

var router = Router();

/**
 * 컨트롤러 연결 클래스
 * @class
 */
export class AuthLocalRoute {
    private passport: LocalPassport;

    /**
     * Creates an instance of AuthLocalIndex.
     * 
     * @param {UserBusiness} factory
     * @param {Environment} config
     */
    constructor(factory: UserBusiness, config: Environment) {
        this.passport = new LocalPassport(factory, config);
    }

    /**
     * route 처리 객체 반환
     *
     * @readonly
     * @type {Router}
     */
    get routes(): Router {
        router.post('/', (req, res, next) => {
            debug(`post /auth/local`);
            passport.authenticate('local', function (err: any, user: IUserModel, info: any) {
                var error = err || info;
                if (error) {
                    return res.status(401).json(error);
                }
                if (!user) {
                    return res.status(404).json({ message: 'Something went wrong, please try again.' });
                }

                let body: any = auth.loginBody(user);
                res.json(body);
            })(req, res, next);
        });

        return router;
    }

    toString() {
        return 'AuthLocalIndex class';
    }
}
