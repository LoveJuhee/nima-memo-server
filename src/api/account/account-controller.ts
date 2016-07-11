'use strict';

/* test-code */
import {IS_DEBUG_ROUTE_ACCOUNT} from '../../debug/flag';
/* end-test-code */

import {LOGGING_ROUTE_ACCOUNT} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_ROUTE_ACCOUNT);

import requestUtil from '../../util/request-util';
import otherUtil from '../../util/other-util';
const nodeUtil = require('util');

import {Request, Response} from 'express';
let passport = require('passport');

import factory from '../../business/account/account-business';

export class AccountController {
    /**
     * 회원가입 post
     * 
     * @param {Request} req
     * @param {Response} res
     * @param {*} next
     */
    signup(req: Request, res: Response, next: any): void {
        debug(req.body.param);
        factory.create(req.body.param)
            .then(r => {
                debug(r);
                req.flash('loginMessage', 'Thank you for registration!');
                res.redirect('/login');
            })
            .catch(err => {
                debug(err);
                res.json({ success: false, message: err });
            });
    }

    /**
     * 탈퇴
     * 
     * @param {Request} req
     * @param {Response} res
     * @param {*} next
     */
    signout(req: Request, res: Response, next: any): void {
        factory.deleteOne(req.body.param)
            .then(r => {
                req.flash('signout message', 'bye bye.');
                res.redirect('/');
            })
            .catch(err => {
                res.json({ success: false, message: err });
            });
    }

    /**
     * 로그인
     * 
     * @param {Request} req
     * @param {Response} res
     */
    login(req: Request, res: Response): void {
    }

    /**
     * 로그인
     * 
     * @param {Request} req
     * @param {Response} res
     */
    logout(req: Request, res: Response): void {

    }

    toString() {
        return 'AccountController class';
    }
}