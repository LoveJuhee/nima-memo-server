'use strict';

import {ApiSocketEvent} from '../../component/api/socket.event';
import {IUserModel} from './user.model';
import {UserDbEvent} from './user.db.event';

import {DEBUG_DB_EVENT_USER} from '../../config/logger';

export class UserSocketEvent extends ApiSocketEvent<IUserModel> {
    constructor(key: string, event: UserDbEvent) {
        super(key, event, DEBUG_DB_EVENT_USER);
    }

    toString() {
        return 'UserSocketEvent class';
    }
}

export default new UserSocketEvent('user', new UserDbEvent());