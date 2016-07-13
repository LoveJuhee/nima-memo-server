'use strict';

import {Application, Request, Response, NextFunction} from 'express';
import {AccountController} from './account-controller';
import {AccountBusiness} from '../../business/account/account-business';

var passport = require('passport');

export class AccountIndex {
    business: AccountBusiness;

    /**
     * Creates an instance of AccountIndex.
     * 
     * @param {Application} app
     * @param {string} [uri=''] 기본 경로
     */
    constructor(app: Application, uri: string = '') {
        if (!app) {
            throw (new Error('app is invalied.'));
        }
        this.business = new AccountBusiness();
        this.link(app, uri, new AccountController());
    }

    /**
     * RESTful 연결
     * 
     * @private
     * @param {string} uri 기본 경로
     * @param {AccountController} controller 처리 객체
     */
    private link(app: Application, uri: string, controller: AccountController): void {

        app.get(uri + '/profile', (req, res, next) => {
            res.send('profile: succeed message');
        });

        app.get(uri + '/signup', (req, res, next) => {
            res.send('signup: failed message');
        });

        app.get(uri + '/login', (req, res, next) => {
            res.send('t4: failed message');
        });

        app.post(uri + '/signup', passport.authenticate('local-signup', {
            successRedirect: uri + '/profile',
            failureRedirect: uri + '/signup',
            failureFlash: true
        }));

        // app.post(uri + '/signup', controller.signup);

        app.delete(uri + '/signout', this.isLoggedIn, controller.signout);

        app.post(uri + '/login', passport.authenticate('local-login', {
            successRedirect: uri + '/profile',
            failureRedirect: uri + '/login',
            failureFlash: true
        }));

        app.get(uri + '/logout', controller.logout);
    }

    /**
     * 전처리 - 로그인 여부
     * 
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns
     */
    isLoggedIn(req: Request, res: Response, next: NextFunction) {
        // if user is authenticate in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }
        // 로그인이 되지 않은 경우 리다이렉트 처리한다.
        // TODO: / 페이지 구현하고 변경한다.
        // res.redirect('/');
        res.redirect('https://github.com/acdetadcd');
    }

    toString() {
        return 'AccountIndex class';
    }
}