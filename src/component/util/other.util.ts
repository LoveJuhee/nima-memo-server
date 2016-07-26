'use strict';

import {Promise} from 'es6-promise';
import objectUtil from './object.util';

class OtherUtil {
    /**
     * Promise then 사용을 위한 단순 출력 객체
     * 
     * @param {*} item 출력할 객체
     * @returns {Promise<Object>} Promise 객체
     */
    print(item: any): Promise<any> {
        if (!item) {
            Promise.resolve();
        }
        return new Promise((resolve: any, reject: any) => {
            console.log(`${objectUtil.inspect(item)}`);
            resolve(item);
        });
    }

    /**
     * Promise then 사용을 위한 단순 출력 객체
     * 
     * @param {*} item 출력할 객체
     * @returns {Promise<Object>} Promise 객체
     */
    printCount(item: any[]): Promise<any[]> {
        if (!item) {
            Promise.resolve();
        }
        return new Promise((resolve: any, reject: any) => {
            console.log(`count: ${item.length}`);
            resolve(item);
        });
    }
}

const otherUtil: OtherUtil = new OtherUtil();
export default otherUtil;