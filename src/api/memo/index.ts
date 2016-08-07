'use strict';

import express = require('express');
import {MemoController} from './memo.controller';
import * as auth from '../../auth/auth.service';

import {MemoDbEvent} from './memo.db.event';
import {MemoSocketEvent} from './memo.socket.event';

var router = express.Router();

/**
 * 컨트롤러 연결 클래스
 * @class
 */
export class MemoIndex {
    /**
     * route 처리 객체 반환
     * 
     * @readonly
     * @type {express.Router}
     */
    get routes(): express.Router {
        let controller: MemoController = new MemoController();

        router.get('/', auth.hasRole('user'), controller.index);
        router.get('/:id', auth.hasRole('user'), controller.show);
        router.post('/', auth.hasRole('user'), controller.create);
        router.put('/:id', auth.hasRole('user'), controller.update);
        router.patch('/:id', auth.hasRole('user'), controller.update);
        router.delete('/:id', auth.hasRole('user'), controller.destroy);

        return router;
    }

    toString() {
        return 'MemoIndex class';
    }
}
