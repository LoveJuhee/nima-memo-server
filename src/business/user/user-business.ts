'use strict';

import {CommonBusiness} from '../common/common-business';
import User from '../../model/user/user';
import {IUserModel} from '../../model/user/user-schema';

import AccountFactory from '../account/account-business';

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
        const NICKNAME: string = item.nickname;
        if (this.isValidUser(EMAIL, NICKNAME) === false) {
            return Promise.reject(new Error('정보가 잘못 되었어요.'));
        }
        return AccountFactory.findByEmail(EMAIL)
            .then(r => {
                if (!r) {
                    return Promise.reject(new Error('account 유저 계정이 없어요.'));
                }
                return super.findOne({ nickname: NICKNAME });
            })
            // nickname을 사용하는 객체가 있는지 검색한 결과 
            .then(r => {
                if (!r) {
                    return super.create(item);
                }
                return Promise.reject(new Error('이미 사용 중인 nickname 이에요.'));
            })
            // 모든 promise 오류 대응
            .catch(err => {
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
                    if (callback) {
                        callback(new Error('email 검색이 안되네요.'), null);
                        return;
                    }
                    return Promise.reject(new Error('email 검색이 안되네요.'));
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
     * @param {string} nickname
     * @returns {boolean}
     */
    public isValidUser(email: string, nickname: string): boolean {
        if (!email || !nickname) {
            return false;
        }
        return true;
    }
}

let factory: UserBusiness = new UserBusiness();
export default factory;