'use strict';

import * as mongoose from 'mongoose';

class MongoUtil {
    /**
     * DB 접속 상태 체크
     * 
     * @param {number} [state=-1]
     * @returns {string}
     */
    public toStringForReadyState(state: number = -1): string {
        switch (state) {
            case 0:
                return 'disconected';
            case 1:
                return 'connected';
            case 2:
                return 'connecting';
            case 3:
                return 'disconnecting';
            default:
                return 'invalid state';
        }
    }
}

const mongoUtil = new MongoUtil();
export default mongoUtil;