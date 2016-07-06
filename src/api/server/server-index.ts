'use strict';
require('source-map-support').install();

import * as express from 'express';
import ServerController from './server-controller';

export const SERVER_API_URI = '/api/nimas';

/**
 * 컨트롤러 연결 클래스
 * @class
 */
export default class ServerIndex {
    constructor(app: express.Application) {
        this.link(app, SERVER_API_URI, new ServerController());
    }

    link(app: express.Application, uri: string, controller: ServerController) {
        app.get(uri + '/', controller.index);
        app.get(uri + '/:quest', controller.show);
        app.post(uri + '/', controller.create);
        app.put(uri + '/:id', controller.update);
        app.patch(uri + '/:id', controller.update);
        app.delete(uri + '/:id', controller.destroy);
    }

    toString() {
        return 'ServerIndex class';
    }
}
