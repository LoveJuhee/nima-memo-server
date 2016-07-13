'use strict';

import {CommonBusiness} from '../common/common-business';
import Account from '../../model/account/account';
import {IAccountModel} from '../../model/account/account-schema';

import {LOGGING_BUSINESS_ACCOUNT} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_BUSINESS_ACCOUNT);

import nodeUtil = require('util');
import passportUtil from '../../util/passport-util';

export class AccountBusiness extends CommonBusiness<IAccountModel> {
    /**
     * Creates an instance of AccountBusiness.
     * 
     */
    constructor() {
        super(Account);
    }

    /**
     * 유저 생성 (추가 이전에 password 암호화 처리가 동작한다.)
     * 
     * @param {*} [{email = '', password = ''}={}]
     * @param {(error: any, result: IAccountModel) => void} [callback=null]
     * @returns {Promise<IAccountModel>}
     */
    create({email = '', password = ''}: any = {}, callback: (error: any, result: IAccountModel) => void = null): Promise<IAccountModel> {
        if (this.isValidAccount(email, password) === false) {
            if (callback) {
                callback(new Error('cond is invalid'), null);
                return;
            }
            return Promise.reject('cond is invalid');
        }
        // let original = password;
        // password = passportUtil.generateHash(original);
        return super.create({ email, password }, callback);
    }

    /**
     * 모든 객체 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} email
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<IAccountModel>}
     */
    findByEmail(email: string, callback: (error: any, result: (IAccountModel | any)) => void = null): Promise<IAccountModel> {
        let cond: Object = {
            email: email
        };
        return super.findOne(cond, callback);
    }

    /**
     * email, password 기반 객체 찾기
     * 
     * @param {*} [{email = '', password = ''}={}] 로그인 계정
     * @param {((error: any, result: (IAccountModel | any)) => void)} [callback=null] 콜백
     * @returns {Promise<IAccountModel>}
     */
    findOne({email = '', password = ''}: any = {}, callback: (error: any, result: (IAccountModel | any)) => void = null): Promise<IAccountModel> {
        let cond: Object = {
            email: email
        };
        return super.findOne(cond)
            .then(r => {
                if (!r) {
                    return Promise.resolve(null);
                }
                debug(r);
                debug(`check password ${password}, ${r.password}`);
                if (passportUtil.isValidPassword(password, r.password + '') === false) {
                    debug(`findOne invalid password`);
                    if (callback) {
                        callback(new Error(`invalid password.`), null);
                        return;
                    }
                    return Promise.reject(new Error(`invalid password.`));
                }
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                debug(`findOne error`);
                debug(err);
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 특정 대상 업데이트
     * 
     * @param {*} item (email, password, newPassword 포함)
     * @param {(error: any, result: IAccountModel) => void} [callback=null]
     * @returns {Promise<IAccountModel>}
     */
    updateOne(item: any, callback: (error: any, result: IAccountModel) => void = null): Promise<IAccountModel> {
        const COND_EMAIL: string = item.email || '';
        const COND_PASSWORD: string = item.password || '';
        const UPDATE_PASSWORD: string = item.newPassword || '';
        if ((this.isValidAccount(COND_EMAIL, COND_PASSWORD) === false) || (!UPDATE_PASSWORD)) {
            if (callback) {
                callback(new Error('cond or update is invalid'), null);
                return;
            }
            return Promise.reject('cond or update is invalid');
        }

        return this.findOne(item)
            .then(r => {
                let cond = { email: COND_EMAIL };
                return super.updateOne(cond, item, callback);
            })
            .catch(err => {
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 특정 대상 삭제
     * 
     * @param {*} cond
     * @param {(error: any, result: IAccountModel) => void} [callback=null]
     * @returns {Promise<IAccountModel>}
     */
    deleteOne({email = '', password = ''}: any = {}, callback: (error: any, result: IAccountModel) => void = null): Promise<IAccountModel> {
        if (this.isValidAccount(email, password) === false) {
            if (callback) {
                callback(new Error('cond is invalid'), null);
                return;
            }
            return Promise.reject('cond is invalid');
        }

        return this.findOne({ email, password })
            .then(r => {
                if (!r) {
                    if (callback) {
                        callback(null, null);
                        return;
                    }
                    return Promise.resolve(null);
                }
                let cond = { _id: r._id };
                return super.deleteOne(cond, callback);
            })
            .catch(err => {
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    toString() {
        return `AccountBusiness class`;
    }

    /**
     * 계정정보 유효한지 확인
     * 
     * @param {string} email
     * @param {string} password
     * @returns {boolean}
     */
    public isValidAccount(email: string, password: string): boolean {
        if (!email || !password) {
            return false;
        }
        return true;
    }
}

let factory: AccountBusiness = new AccountBusiness();
export default factory;