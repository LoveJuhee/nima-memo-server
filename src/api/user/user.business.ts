'use strict';

import {CommonBusiness} from '../../component/business/common.business';
import User, {IUserModel} from './user.model';

import {DEBUG_BUSINESS_USER} from '../../config/logger';

export class UserBusiness extends CommonBusiness<IUserModel> {
    constructor() {
        super(User, DEBUG_BUSINESS_USER);
    }

    /**
     * email 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} email
     * @param {string} [filter]
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    findByEmail(email: string, filter?: string, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        if (!email) {
            return this.returnInvalidParams(callback);
        }
        return this.findOne({ email }, filter, callback);
    }

    /**
     * 암호 갱신
     * 
     * @param {*} [{email = '', password = ''}={}]
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    updatePassword({email = '', password = ''}: any = {}, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        if (!email || !password) {
            return this.returnInvalidParams(callback);
        }
        // TODO: promise 리턴이 아닌 undefined 리턴이 되는 문제 확인.
        // user.business.spec.ts 에서 암호 갱신 테스트에서 발생하는 문제
        return this.returnOne(this._updatePassword(email, password), callback);
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
                    this.debugger(`updatePassword done`);
                    this.debugger(res);
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
     * 
     * @param {*} cond
     * @param {*} item
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    updateOne(cond: any, item: any, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        if (!cond || !item) {
            return this.returnInvalidParams(callback);
        }
        delete item.password;
        return super.updateOne(cond, item, callback);
    }

    /**
     * 특정 대상 삭제
     * 
     * @param {string} [email]
     * @param {(error: any, result: IUserModel) => void} [callback=null]
     * @returns {Promise<IUserModel>}
     */
    deleteByEmail(email: string, callback: (error: any, result: IUserModel) => void = null): Promise<IUserModel> {
        if (!email) {
            return this.returnInvalidParams(callback);
        }
        return super.deleteOne({ email }, callback);
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
            return this.returnInvalidParams(callback);
        }
        return super.findOne(cond, filter, callback);
    }
}

let factory: UserBusiness = new UserBusiness();
export default factory;