'use strict';

import {ApiSocketEvent} from '../../component/api/socket.event';
import {IServerModel} from './server.model';
import {ServerDbEvent} from './server.db.event';

import {DEBUG_DB_EVENT_SERVER} from '../../config/logger';
import * as debugClass from 'debug';

export class ServerSocketEvent extends ApiSocketEvent<IServerModel> {
    constructor(key: string, event: ServerDbEvent) {
        super(key, event, DEBUG_DB_EVENT_SERVER);
    }

    toString() {
        return 'ServerSocketEvent  class';
    }
}

export default new ServerSocketEvent('server', new ServerDbEvent());