'use strict';

import {ApiDbEvent, DbEventKeyValue} from '../../component/api/db.event';
import * as event from '../../component/api/db.event.instance';
import {UserSchema, IUserModel} from './user.model';

import {DEBUG_DB_EVENT_USER} from '../../config/logger';

export class UserDbEvent extends ApiDbEvent<IUserModel> {
    constructor() {
        super(UserSchema, DEBUG_DB_EVENT_USER);
    }

    getEvents(): DbEventKeyValue[] {
        let events = [
            event.DB_EVENT_SAVE,
            event.DB_EVENT_UPDATE,
            event.DB_EVENT_REMOVE,
        ]
        return events;
    }

    preset(item: IUserModel): IUserModel {
        if (item) {
            let result: any = {};
            result.email = item.email;
            result.nick = item.nick;
            return result;
        }
        return item;
    }

    toString() {
        return 'UserDbEvent class';
    }
}