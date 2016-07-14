'use strict';

/* test-code */
import {IS_DEBUG_ROUTE_ACCOUNTS} from '../../debug/flag';
/* end-test-code */

import {DEBUG_ROUTE_ACCOUNTS} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_ROUTE_ACCOUNTS);

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
    signup(req: Request, res: Response): void {
        debug(req.body);
        debug(`email: ${req.body.email}, password: ${req.body.password}`);
        factory.create(req.body)
            .then(r => {
                debug('signup success');
                debug(r);
                res.json({ success: true, message: r });
                // req.flash('loginMessage', 'Thank you for registration!');
                // res.redirect('/login');
            })
            .catch(err => {
                debug('signup failed');
                debug(err);
                res.json({ success: false, message: err });
            });
    }

    /**
     * 탈퇴
     * 
     * @param {Request} req
     * @param {Response} res
     */
    signout(req: Request, res: Response): void {
        factory.deleteOne(req.body)
            .then(r => {
                req.flash('signout message', 'bye bye.');
                // TODO: 탈퇴 시 이동할 페이지 추후에 반영
                res.redirect('http://www.naver.com');
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
        req.logout();
        // TODO: 로그아웃 시 이동할 페이지 추후에 반영
        res.redirect('http://www.naver.com');
    }

    toString() {
        return 'AccountController class';
    }
}