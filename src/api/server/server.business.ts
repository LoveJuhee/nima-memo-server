'use strict';

import {CommonBusiness} from '../../component/business/common.business';
import ServerModel, {IServerModel} from './server.model';

import {DEBUG_BUSINESS_SERVER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_BUSINESS_SERVER);

export class ServerBusiness extends CommonBusiness<IServerModel> {
    constructor() {
        super(ServerModel);
    }

    /**
     * Server 생성
     * 
     * @param {*} item
     * @param {(error: any, result: IServerModel) => void} [callback=null]
     * @returns {Promise<IServerModel>}
     */
    create(item: any, callback?: (error: any, result?: IServerModel) => void): Promise<IServerModel> {
        return this._create(item)
            .then(r => {
                debug(`create succeed`);
                debug(r);
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                debug(`create failed`);
                debug(err);
                if (callback) {
                    callback(err);
                    return;
                }
                debug(err);
                return Promise.reject(err);
            });
    }

    /**
     * Server 생성
     * 
     * @private
     * @param {*} item
     * @returns {Promise<IServerModel>}
     */
    private _create(item: any): Promise<IServerModel> {
        return super.create(item)
            .then(r => {
                return Promise.resolve(r);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    /**
     * 삭제
     * 
     * @param {string} _id
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<IServerModel>}
     */
    findByIdAndRemove(_id: string, callback?: (error: any, result?: any) => void): Promise<IServerModel> {
        return this._findByIdAndRemove(_id)
            .then(r => {
                debug(`findByIdAndRemove succeed`);
                debug(r);
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                debug(`findByIdAndRemove failed`);
                debug(err);
                if (callback) {
                    callback(err);
                    return;
                }
                debug(err);
                return Promise.reject(err);
            });
    }

    /**
     * 삭제
     * 
     * @private
     * @param {string} _id
     * @returns {Promise<IServerModel>}
     */
    private _findByIdAndRemove(_id: string): Promise<IServerModel> {
        return super.findByIdAndRemove(_id)
            .then(r => {
                return Promise.resolve(r);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    toString() {
        return 'ServerBusiness class';
    }
}

let factory: ServerBusiness = new ServerBusiness();
export default factory;