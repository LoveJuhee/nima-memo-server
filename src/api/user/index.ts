'use strict';

import express = require('express');
import {UserController} from './user.controller';

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

        router.get('/', controller.index);
        router.get('/:id', controller.show);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.patch('/:id', controller.update);
        router.delete('/:id', controller.destroy);

        return router;
    }

    toString() {
        return 'UserIndex class';
    }
}