'use strict';

import * as express from 'express';
import * as passport from 'passport';

import config from '../config/environment';
import User from '../api/user/user.business';

import {AuthLocalRoute} from './local';

/**
 * 인증 처리 클래스
 * @class
 */
export class AuthRoute {
    /**
     * route 처리 객체 반환
     *
     * @readonly
     * @type {express.Router}
     */
    get routes(): express.Router {

        // Passport Configuration
        // require('./facebook/passport').setup(User, config);
        // require('./google/passport').setup(User, config);
        // require('./twitter/passport').setup(User, config);

        var router = express.Router();

        router.use('/local', new AuthLocalRoute(User, config).routes);
        // router.use('/facebook', require('./facebook'));
        // router.use('/twitter', require('./twitter'));
        // router.use('/google', require('./google'));

        return router;
    }

    toString() {
        return 'AuthRoute class';
    }
}