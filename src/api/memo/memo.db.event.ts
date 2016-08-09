'use strict';

import {ApiDbEvent, DbEventKeyValue} from '../../component/api/db.event';
import * as event from '../../component/api/db.event.instance';

import {DEBUG_DB_EVENT_MEMO} from '../../config/logger';
import {MemoSchema, IMemoModel} from './memo.model';

export class MemoDbEvent extends ApiDbEvent<IMemoModel> {
    constructor() {
        super(MemoSchema, DEBUG_DB_EVENT_MEMO);
    }

    getEvents(): DbEventKeyValue[] {
        let events = [
            event.DB_EVENT_SAVE,
            event.DB_EVENT_UPDATE,
            event.DB_EVENT_REMOVE,
        ];
        return events;
    }

    preset(item: IMemoModel): IMemoModel {
        if (item) {
            let remove: any = item;
            remove.__v = undefined;
            item.id = undefined;
        }
        return item;
    }

    toString() {
        return 'MemoDbEvent extends ApiDbEvent class';
    }
}