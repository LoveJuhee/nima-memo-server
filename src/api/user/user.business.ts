'use strict';

import {CommonBusiness} from '../../component/business/common.business';
import User, {IUserModel} from './user.model';

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
                debug(`create failed`);
                debug(item);
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
        const PASSWORD: string = item.password;
        if (!EMAIL || !PASSWORD) {
            return Promise.reject(new Error(`정보가 잘못 되었어요. email:${EMAIL}, password:${PASSWORD}`));
        }
        return super.create(item);
    }

    /**
     * email 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} [email='']
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    findByEmail(email: string = '', callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        return this.findOne({ email })
            .then(r => {
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                debug(`findByEmail failed. email: ${email}`);
                debug(err);
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 암호 갱신
     * 
     * @param {*} [{email = '', password = ''}={}]
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    updatePassword({email = '', password = ''}: any = {}, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        // TODO: promise 리턴이 아닌 undefined 리턴이 되는 문제 확인.
        // user.business.spec.ts 에서 암호 갱신 테스트에서 발생하는 문제
        return this._updatePassword(email, password)
            .then(r => {
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            // this._updatePassword 에러 처리.
            .catch(err => {
                debug(`updatePassword failed`);
                debug(`email: ${email}, password: ${password}`);
                debug(err);
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 암호 갱신 실제 수행
     * 
     * @private
     * @param {string} email
     * @param {string} password
     * @returns {Promise<IUserModel>}
     */
    private _updatePassword(email: string, password: string): Promise<IUserModel> {
        if (!email || !password) {
            return Promise.reject(`email 또는 password 오류`);
        }
        return this.findOne({ email: email })
            .then(r => {
                if (!r) {
                    let err: any = new Error(`${email} 검색이 안되네요.`);
                    return Promise.reject(err);
                }
                r.password = password;
                r.save((err, res) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                    debug(`updatePassword done`);
                    debug(res);
                    return Promise.resolve(res);
                });
            })
            // this.findOne, r.save 에러 및 검색결과가 없을 경우 처리.
            .catch(err => {
                return Promise.reject(err);
            });
    }

    /**
     * 특정 대상 업데이트 : 암호는 갱신하지 않는다.
     * 
     * @param {*} item (email 포함)
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    updateOne(item: any, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        return this.findOne({ email: item.email })
            .then(r => {
                if (!r) {
                    let err: any = new Error(`${item.email} 검색이 안되네요.`);
                    return Promise.reject(err);
                }
                let cond = { _id: r._id };
                delete item.password;
                return super.updateOne(cond, item, callback);
            })
            // this.findOne, super.updateOne 에러 및 검색결과가 없을 경우 처리.
            .catch(err => {
                debug(`updatePassword failed`);
                debug(item);
                debug(err);
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
        return this.findOne({ email })
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
                debug(`updatePassword failed`);
                debug(email);
                debug(err);
                if (callback) {
                    callback(err, null);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 객체 검색 (email 또는 nick 또는 _id 값이 있어야 한다.)
     * 
     * @param {*} [cond={}]
     * @param {string} [filter='']
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    findOne(cond: any = {}, filter: string = '', callback: (error: any, result: any) => void = null): Promise<IUserModel> {
        if (!cond.email && !cond.nick && !cond._id) {
            return Promise.reject('email, nick, _id is empty.');
        }
        return super.findOne(cond, filter, callback);
    }

    toString() {
        return 'UserBusiness class';
    }
}

let factory: UserBusiness = new UserBusiness();
export default factory;