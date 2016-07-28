'use strict';

import {DbEventKeyValue} from './db.event';

export const DB_EVENT_SAVE = new DbEventKeyValue('save', 'save');
export const DB_EVENT_UPDATE = new DbEventKeyValue('update', 'update');
export const DB_EVENT_REMOVE = new DbEventKeyValue('remove', 'remove');