'use strict';

import CommonBusiness from '../common/common-business';
import Account from '../../model/account/account';
import {IAccountModel} from '../../model/account/account-schema';

import nodeUtil = require('util');

export default class AccountBusiness extends CommonBusiness<IAccountModel> {
    constructor() {
        super(Account);
    }

    /**
     * 모든 객체 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} email
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<IAccountModel>}
     */
    findByEmail(email: string, callback: (error: any, result: any) => void = null): Promise<IAccountModel> {
        let cond: Object = {
            email: email
        };
        return this.findOne(cond, callback);
    }

    /**
     * 특정 대상 업데이트
     * 
     * @param {*} cond
     * @param {*} update
     * @param {(error: any, result: IAccountModel) => void} [callback=null]
     * @returns {Promise<IAccountModel>}
     */
    updateOne(cond: any, update: any, callback: (error: any, result: IAccountModel) => void = null): Promise<IAccountModel> {
        let email: string = cond.email || '';
        let password: string = cond.password || '';
        let email2: string = update.email || '';
        if (email.length === 0 || password.length === 0 || email !== email2) {
            if (callback) {
                callback(new Error('cond or update is invalid'), null);
            } else {
                Promise.reject('cond or update is invalid');
            }
            return;
        }
        return super.updateOne(cond, update, callback);
    }

    /**
     * 특정 대상 삭제
     * 
     * @param {*} cond
     * @param {(error: any, result: IAccountModel) => void} [callback=null]
     * @returns {Promise<IAccountModel>}
     */
    deleteOne(cond: any, callback: (error: any, result: IAccountModel) => void = null): Promise<IAccountModel> {
        let email: string = cond.email || '';
        let password: string = cond.password || '';
        if (email.length === 0 || password.length === 0) {
            if (callback) {
                callback(new Error('cond is invalid'), null);
            } else {
                Promise.reject('cond is invalid');
            }
            return;
        }
        return super.deleteOne(cond, callback);
    }

    toString() {
        return `AccountBusiness class`;
    }
}