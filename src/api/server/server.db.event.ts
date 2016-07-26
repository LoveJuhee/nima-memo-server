'use strict';

import {ApiDbEvent} from '../../component/api/db.event';
import * as event from '../../component/api/db.event.instance';

import {DEBUG_DB_EVENT_SERVER} from '../../config/logger';
import {ServerSchema, IServerModel} from './server.model';

export class ServerDbEvent extends ApiDbEvent<IServerModel> {
    constructor() {
        super(ServerSchema, DEBUG_DB_EVENT_SERVER);
    }

    getEvents(): { dbEvent: string, event: string }[] {
        let events = [
            event.DB_EVENT_SAVE,
            event.DB_EVENT_UPDATE,
            event.DB_EVENT_FIND_BY_ID_AND_UPDATE,
            event.DB_EVENT_REMOVE,
            event.DB_EVENT_FIND_BY_ID_AND_REMOVE
        ];
        return events;
    }

    preset(item: IServerModel): IServerModel {
        if (item) {
            let remove: any = item;
            remove.__v = undefined;
            item.id = undefined;
        }
        return item;
    }

    toString() {
        return 'ServerDbEvent extends ApiDbEvent class';
    }
}