'use strict';

import mongoose = require('mongoose');
import {Promise} from 'es6-promise';

import {LOGGING_BUSINESS_COMMON} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_BUSINESS_COMMON);

/**
 * 공통 비지니스 클래스
 * 
 * @export
 * @class CommonBusiness
 * @template T
 */
export default class CommonBusiness<T extends mongoose.Document> {
    private _model: mongoose.Model<mongoose.Document>;

    /**
     * Creates an instance of CommonBusiness.
     * 
     * @param {mongoose.Model<mongoose.Document>} schemaModel
     */
    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    /**
     * 추가 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {T} item
     * @param {(error: any, result: T) => void} [callback=null]
     * @returns {Promise<T>}
     */
    create(item: T, callback: (error: any, result: T) => void = null): Promise<T> {
        if (callback) {
            this._model.create(item, callback);
            return;
        }
        debug(`create return new Promise()`);
        return new Promise((resolve: any, reject: any) => {
            this._model.create(item, (err: any, res: T) => {
                if (err) {
                    debug(`create reject()`);
                    reject(err);
                }
                debug(`create resolve()`);
                resolve(res);
            });
        });
    }

    /**
     * 갱신 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {mongoose.Types.ObjectId} _id
     * @param {T} item
     * @param {(err: any, affectedRows: number, raw: any) => void} [callback=null]
     * @returns {Promise<number>}
     */
    update(_id: mongoose.Types.ObjectId, item: T, callback: (err: any, affectedRows: number, raw: any) => void = null): Promise<any> {
        if (callback) {
            this._model.update({ _id: _id }, item, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.update({ _id: _id }, item, (err: any, affectedRows: number, raw: any) => {
                if (err) {
                    debug(`update reject()`);
                    reject(err);
                }
                debug(`update resolve()`);
                console.log(affectedRows);
                console.log(raw);
                resolve(affectedRows);
            });
        });
    }

    /**
     * 특정 대상 업데이트
     * 
     * @param {Object} cond
     * @param {Object} update
     * @param {(error: any, result: T) => void} [callback=null]
     * @returns {Promise<T>}
     */
    updateOne(cond: Object, update: Object, callback: (error: any, result: T) => void = null): Promise<T> {
        if (callback) {
            this._model.findOneAndUpdate(cond, update, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findOneAndUpdate(cond, update, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    /**
     * 특정 대상 삭제
     * 
     * @param {Object} cond
     * @param {(error: any, result: T) => void} [callback=null]
     * @returns {Promise<T>}
     */
    deleteOne(cond: Object, callback: (error: any, result: T) => void = null): Promise<T> {
        if (callback) {
            this._model.findOneAndRemove(cond, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findOneAndRemove(cond, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    /**
     * 삭제 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} _id
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<T>}
     */
    delete(_id: string, callback: (error: any, result: any) => void = null): Promise<T> {
        debug(`delete _id: ${_id}`);
        if (callback) {
            this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.remove({ _id: this.toObjectId(_id) }, (err) => {
                if (err) {
                    debug(`delete reject()`);
                    reject(err);
                }
                debug(`delete resolve()`);
                resolve(null);
            });
        });
    }

    /**
     * 모든 객체 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<T[]>}
     */
    findAll(callback: (error: any, result: any) => void = null): Promise<T[]> {
        if (callback) {
            this._model.find({}, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.find({}, (err: any, res: T[]) => {
                if (err) {
                    debug(`findAll reject()`);
                    reject(err);
                }
                debug(`findAll resolve()`);
                resolve(res);
            });
        });
    }

    /**
     * 특정 조건 객체 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {Object} [cond={}]
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<T[]>}
     */
    find(cond: Object = {}, callback: (error: any, result: any) => void = null): Promise<T[]> {
        if (callback) {
            this._model.find(cond, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.find(cond, (err: any, res: T[]) => {
                if (err) {
                    debug(`find reject()`);
                    reject(err);
                }
                debug(`find resolve()`);
                resolve(res);
            });
        });
    }

    /**
     * findOne
     */
    public findOne(cond: any, callback: (error: any, result: any) => void = null): Promise<T> {
        if (callback) {
            this._model.findOne(cond, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findOne(cond, (err: any, res: T) => {
                if (err) {
                    debug(`findOne reject()`);
                    reject(err);
                }
                debug(`findOne resolve()`);
                resolve(res);
            });
        });
    }

    /**
     * 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} _id
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<T>}
     */
    findById(_id: string, callback: (error: any, result: any) => void = null): Promise<T> {
        if (callback) {
            this._model.findById(_id, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findById(_id, (err: any, res: T) => {
                if (err) {
                    debug(`findById reject()`);
                    reject(err);
                }
                debug(`findById resolve()`);
                resolve(res);
            });
        });
    }

    /**
     * ObjectId로 변환
     * 
     * @private
     * @param {string} _id
     * @returns {mongoose.Types.ObjectId}
     */
    protected toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }
}