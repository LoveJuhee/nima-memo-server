'use strict';

import {ApiSocketEvent} from '../../component/api/socket.event';
import {IMemoModel} from './memo.model';
import {MemoDbEvent} from './memo.db.event';

import {DEBUG_DB_EVENT_MEMO} from '../../config/logger';
import * as debugClass from 'debug';

export class MemoSocketEvent extends ApiSocketEvent<IMemoModel> {
    constructor(key: string, event: MemoDbEvent) {
        super(key, event, DEBUG_DB_EVENT_MEMO);
    }

    toString() {
        return 'MemoSocketEvent  class';
    }
}

export default new MemoSocketEvent('memo', new MemoDbEvent());