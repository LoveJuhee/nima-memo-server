'use strict';

import {CommonBusiness} from '../../component/business/common.business';
import User, {IUserModel} from './user.model';
// import {IUserModel} from './user.schema';

import AccountFactory from '../account/account.business';

import {DEBUG_BUSINESS_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_BUSINESS_USER);

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
     * Account 데이터에 정보가 있을 경우 수행한다.
     * 
     * @private
     * @param {*} item
     * @returns {Promise<IUserModel>}
     */
    private _create(item: any): Promise<IUserModel> {
        const EMAIL: string = item.email;
        const NICK: string = item.nick;
        if (this.isValidUser(EMAIL, NICK) === false) {
            return Promise.reject(new Error(`정보가 잘못 되었어요. email:${EMAIL}, nick:${NICK}`));
        }
        return AccountFactory.findByEmail(EMAIL)
            .then(r => {
                if (!r) {
                    return Promise.reject(new Error('account 유저 계정이 없어요.'));
                }
                return super.findOne({ nick: NICK });
            })
            // nick을 사용하는 객체가 있는지 검색한 결과 
            .then(r => {
                if (!r) {
                    return super.create(item);
                }
                return Promise.reject(new Error('이미 사용 중인 nick 이에요.'));
            })
            // 모든 promise 오류 대응
            .catch(err => {
                return Promise.reject(err);
            });
    }

    /**
     * email 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} [email='']
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    findByEmail(email: string = '', callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        return this._findOne({ email })
            .then(r => {
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
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
     * 실제로 User 검색 수행
     * 
     * @private
     * @param {*} [{email = '', nick = ''}={}]
     * @returns {Promise<IUserModel>}
     */
    private _findOne(item: any = {}): Promise<IUserModel> {
        const EMAIL: string = item.email;
        const NICKNAME: string = item.nick;
        if (!EMAIL && !NICKNAME) {
            return Promise.reject(new Error(`invalid parameter(email:${EMAIL}, nick:${NICKNAME})`));
        }
        return super.findOne(item);
    }

    /**
     * 특정 대상 업데이트
     * 
     * @param {*} item (email 포함)
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    updateOne(item: any, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        return this._findOne({ email: item.email })
            .then(r => {
                if (!r) {
                    let err: any = new Error(`${item.email} 검색이 안되네요.`);
                    return Promise.reject(err);
                }
                let cond = { _id: r._id };
                return super.updateOne(cond, item, callback);
            })
            // this._findOne, super.updateOne 에러 및 검색결과가 없을 경우 처리.
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
     * @param {string} [email='']
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    deleteOne(email: string = '', callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        return this._findOne({ email })
            .then(r => {
                if (!r) {
                    let err: any = new Error(`${email} 검색이 안되네요.`);
                    return Promise.reject(err);
                }
                let cond = { _id: r._id };
                return super.deleteOne(cond, callback);
            })
            // 모든 promise 오류 대응
            .catch(err => {
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    toString() {
        return 'UserBusiness class';
    }

    /**
     * 유저 정보가 유효한가에 대한 판단
     * 
     * @param {string} email
     * @param {string} nick
     * @returns {boolean}
     */
    public isValidUser(email: string, nick: string): boolean {
        if (!email || !nick) {
            return false;
        }
        return true;
    }
}

let factory: UserBusiness = new UserBusiness();
export default factory;