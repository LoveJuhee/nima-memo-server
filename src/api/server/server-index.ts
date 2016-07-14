'use strict';

import express = require('express');
import {ServerController} from './server-controller';

var router = express.Router();

/**
 * 컨트롤러 연결 클래스
 * @class
 */
export default class ServerIndex {
    /**
     * route 처리 객체 반환
     * 
     * @readonly
     * @type {express.Router}
     */
    get routes(): express.Router {
        let controller: ServerController = new ServerController();

        router.get('/', controller.index);
        router.get('/:id', controller.show);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.patch('/:id', controller.update);
        router.delete('/:id', controller.destroy);

        return router;
    }

    toString() {
        return 'ServerIndex class';
    }
}
