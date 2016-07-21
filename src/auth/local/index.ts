'use strict';

import {Router, Request, Response, NextFunction} from 'express';
import * as passport from 'passport';

import {signToken} from '../auth.service';
import {IUserModel} from '../../api/user/user.model';

import {LocalPassport} from './passport';

var router = Router();

/**
 * 컨트롤러 연결 클래스
 * @class
 */
export class AuthLocalIndex {
    constructor(factory: any, config: any) {

    }
    /**
     * route 처리 객체 반환
     *
     * @readonly
     * @type {Router}
     */
    get routes(): Router {
        router.post('/', (req, res, next) => {
            passport.authenticate('local', function (err: any, user: IUserModel, info: any) {
                var error = err || info;
                if (error) {
                    return res.status(401).json(error);
                }
                if (!user) {
                    return res.status(404).json({ message: 'Something went wrong, please try again.' });
                }

                var token = signToken(user._id, user.role);
                res.json({ token });
            })(req, res, next);
        });

        return router;
    }

    toString() {
        return 'AuthLocalIndex class';
    }
}
