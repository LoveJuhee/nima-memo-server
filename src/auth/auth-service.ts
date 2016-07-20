'use strict';

import {Request, Response, NextFunction} from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
var compose = require('composable-middleware');

import ENVIRONMENT from '../config/environment';
import User from '../api/user/user.business';

var validateJwt = expressJwt({
    secret: ENVIRONMENT.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 * 
 * @export
 * @returns {void}
 */
export function isAuthenticated(): void {
    return compose()
        // Validate jwt
        .use(function (req: Request, res: Response, next: NextFunction) {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers['authorization'] = 'Bearer ' + req.query.access_token;
            }
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function (req: Request, res: Response, next: NextFunction) {
            User.findOne({ _id: req.user._id })
                .then(user => {
                    if (!user) {
                        return res
                            .status(401)
                            .end();
                    }
                    req.user = user;
                    next();
                })
                .catch(err => next(err));
        });
}

/**
 * add to auth info
 * 
 * @export
 * @param {any} argument
 * @returns {void}
 */
export function writeAuthInfo(argument: any): void {
    return compose()
        // Validate jwt
        .use(function (req: Request, res: Response, next: NextFunction) {
            req.user = {};

            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers['authorization'] = 'Bearer ' + req.query.access_token;
            }

            if (req.headers['authorization']) {
                validateJwt(req, res, next);
            } else {
                next();
            }
        })
        // Attach user to request
        .use(function (req: Request, res: Response, next: NextFunction) {
            if (req.user && req.user._id) {
                User.findOne({ _id: req.user._id })
                    .then(user => {
                        req.user = user;
                        next();
                    })
                    .catch(err => next(err));
            } else {
                next();
            }
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired: any) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req: Request, res: Response, next: NextFunction): void {
            if (ENVIRONMENT.userRoles.indexOf(req.user.role) >= ENVIRONMENT.userRoles.indexOf(roleRequired)) {
                next();
            } else {
                res
                    .status(403)
                    .send('Forbidden');
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id: string, role: string): string {
    let payload = {
        _id: id,
        role: role
    };
    let options: jwt.SignOptions = {};
    options.expiresIn = ENVIRONMENT.secrets.expiresIn;
    return jwt.sign(payload, ENVIRONMENT.secrets.session, options);
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req: Request, res: Response) {
    if (!req.user) {
        return res
            .status(404)
            .send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
}
