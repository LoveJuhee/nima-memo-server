'use strict';
import {Promise} from 'es6-promise';
import nodeUtil = require('util');

class OtherUtil {
    /**
     * Promise then 사용을 위한 단순 출력 객체
     * 
     * @param {*} item 출력할 객체
     * @returns {Promise<Object>} Promise 객체
     */
    print(item: any): Promise<Object> {
        return new Promise((resolve: any, reject: any) => {
            if (!item) {
                reject(new Error('item is null or undefined'));
            }
            console.log(`${nodeUtil.inspect(item)}`);
            resolve(item);
        });
    }
}

const otherUtil: OtherUtil = new OtherUtil();
export default otherUtil;