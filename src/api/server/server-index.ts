'use strict';

import {Application} from 'express';
import ServerController from './server-controller';

/**
 * 컨트롤러 연결 클래스
 * @class
 */
export default class ServerIndex {
    constructor(app: Application, uri: string) {
        if (app && uri) {
            this.link(app, uri, new ServerController());
        } else {
            throw (new Error('app or uri is invalied.'));
        }
    }

    link(app: Application, uri: string, controller: ServerController) {
        app.get(uri + '/', controller.index);
        app.get(uri + '/:id', controller.show);
        app.post(uri + '/', controller.create);
        app.put(uri + '/:id', controller.update);
        app.patch(uri + '/:id', controller.update);
        app.delete(uri + '/:id', controller.destroy);
    }

    toString() {
        return 'ServerIndex class';
    }
}
