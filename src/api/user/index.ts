'use strict';

import express = require('express');
import {UserController} from './user.controller';
import * as auth from '../../auth/auth.service';

var router = express.Router();

/**
 * 컨트롤러 연결 클래스
 * @class
 */
export class UserIndex {
    /**
     * route 처리 객체 반환
     *
     * @readonly
     * @type {express.Router}
     */
    get routes(): express.Router {
        let controller: UserController = new UserController();

        router.get('/', auth.hasRole('admin'), controller.index);
        router.delete('/:id', auth.hasRole('admin'), controller.destroy);
        router.get('/me', auth.isAuthenticated(), controller.me);
        router.put('/:id', auth.isAuthenticated(), controller.update);
        router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
        router.get('/:id', auth.isAuthenticated(), controller.show);
        router.post('/', controller.create);

        return router;
    }

    toString() {
        return 'UserIndex class';
    }
}