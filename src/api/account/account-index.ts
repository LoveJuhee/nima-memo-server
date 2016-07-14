'use strict';

import express = require('express');
import passport = require('passport');

import {AccountController} from './account-controller';

var router = express.Router();

export class AccountIndex {
    /**
     * route 처리 객체 반환
     * 
     * @readonly
     * @type {express.Router}
     */
    get routes(): express.Router {
        let controller: AccountController = new AccountController();

        // TODO: token 기능 구현
        // TODO: front-end 분리 하도록 구현

        router.get('/profile', (req, res, next) => {
            res.send('profile: succeed message');
        });

        router.get('/signup', (req, res, next) => {
            res.send('signup: failed message');
        });

        router.get('/login', (req, res, next) => {
            res.send('t4: failed message');
        });

        router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            failureFlash: true
        }));

        // router.post('/signup', controller.signup);

        router.delete('/signout', this.isLoggedIn, controller.signout);

        router.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));

        router.get('/logout', controller.logout);
        return router;
    }

    /**
     * 전처리 - 로그인 여부
     * 
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @returns
     */
    isLoggedIn(req: express.Request, res: express.Response, next: express.NextFunction) {
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