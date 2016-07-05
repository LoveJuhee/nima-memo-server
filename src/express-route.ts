'use strict';

import * as express from 'express';

/**
 * 컨트롤러 연결 클래스
 * @class
 */
class Linker {
    /**
     * 
     * 
     * @param {express.Application} app
     * @param {string} uri
     * @param {*} controller
     */
    link(app: express.Application, uri: string, controller: any) {
        app.get(uri, controller.index);
        app.get(uri + ':id', controller.show);
        app.post(uri, controller.create);
        app.put(uri + ':id', controller.update);
        app.patch(uri + ':id', controller.update);
        app.delete(uri + ':id', controller.destroy);
    }

    /**
     * 객체 정보 출력
     * 
     * @returns
     */
    toString() {
        return 'Linker class';
    }
}

/**
 * 라우트 처리 클래스
 * 
 * @export
 * @class Routes
 */
export class Routes {

    /**
     * Creates an instance of Routes.
     * 
     * @param {express.Application} app
     */
    constructor(app: express.Application) {
        if (!app) {
            throw (new Error('app is null or undefined.'));
        }
    }

    /**
     * 객체 정보 출력
     * 
     * @returns
     */
    toString() {
        return 'Routes class';
    }
}
