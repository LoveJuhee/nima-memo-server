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
            } else {
                Promise.reject('cond is invalid');
            }
            return;
        }
        let original = password;
        password = passportUtil.generateHash(original);
        return super.create({ email, password }, callback);
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
        const COND_EMAIL: string = cond.email || '';
        const COND_PASSWORD: string = cond.password || '';
        const UPDATE_PASSWORD: string = update.password || '';
        if ((this.isValidAccount(COND_EMAIL, COND_PASSWORD) === false) || (!UPDATE_PASSWORD)) {
            if (callback) {
                callback(new Error('cond or update is invalid'), null);
            } else {
                Promise.reject('cond or update is invalid');
            }
            return;
        }
        // hash 값 변경된 객체로 검색을 하고 갱신을 하도록 해야한다. 
        cond.password = passportUtil.generateHash(COND_PASSWORD);
        let password = passportUtil.generateHash(UPDATE_PASSWORD);
        return super.updateOne(cond, { password }, callback);
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
            } else {
                Promise.reject('cond is invalid');
            }
            return;
        }
        let original = password;
        password = passportUtil.generateHash(original);
        return super.deleteOne({ email, password }, callback);
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