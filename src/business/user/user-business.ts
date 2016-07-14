'use strict';

import {CommonBusiness} from '../common/common-business';
import User from '../../model/user/user';
import {IUserModel} from '../../model/user/user-schema';

import AccountFactory from '../account/account-business';

import {LOGGING_BUSINESS_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_BUSINESS_USER);

export class UserBusiness extends CommonBusiness<IUserModel> {
    constructor() {
        super(User);
    }

    /**
     * User 계정 생성
     * 
     * @param {*} item
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    create(item: any, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        return this._create(item)
            .then(r => {
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                debug(err);
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 실질적인 User 계정 생성 로직 수행
     * 
     * @private
     * @param {*} item
     * @returns {Promise<IUserModel>}
     */
    private _create(item: any): Promise<IUserModel> {
        const EMAIL: string = item.email;
        const NICKNAME: string = item.nickname;
        if (this.isValidUser(EMAIL, NICKNAME) === false) {
            return Promise.reject(new Error('정보가 잘못 되었어'));
        }
        return AccountFactory.findByEmail(EMAIL)
            .then(r => {
                if (!r) {
                    return Promise.reject(new Error('유저 계정이 없어'));
                }
                return super.create(item);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    toString() {
        return 'UserBusiness class';
    }

    public isValidUser(email: string, nickname: string): boolean {
        if (!email || !nickname) {
            return false;
        }
        return true;
    }
}

let factory: UserBusiness = new UserBusiness();
export default factory;