'use strict';

import * as mongoose from 'mongoose';
import {Promise} from 'es6-promise';

import {DEBUG_BUSINESS_COMMON} from '../../config/logger';
import * as debugClass from 'debug';

/**
 * 공통 비지니스 클래스
 * 
 * @export
 * @class CommonBusiness
 * @template T
 */
export class CommonBusiness<T extends mongoose.Document> {
    private _debugger: debug.IDebugger;
    private _model: mongoose.Model<T>;

    /**
     * Creates an instance of CommonBusiness.
     * 
     * @param {mongoose.Model<T>} schemaModel
     */
    constructor(schemaModel: mongoose.Model<T>, debugKey: string = DEBUG_BUSINESS_COMMON) {
        this._model = schemaModel;
        this._debugger = debugClass(debugKey);
    }

    /**
     * 디버그 객체
     * 
     * @readonly
     * @type {debug.IDebugger}
     */
    get debugger(): debug.IDebugger {
        return this._debugger;
    }

    /**
     * 값 문제 반환
     * 
     * @protected
     * @param {*} [callback=null]
     * @returns {Promise<any>}
     */
    protected returnInvalidParams(callback: any = null): Promise<any> {
        let err = new Error(`invalid params`);
        if (callback) {
            callback(err);
            return;
        }
        return Promise.reject(err);
    }

    /**
     * 한개 작업에 대한 리턴 처리
     * 
     * @protected
     * @param {Promise<T>} promise
     * @param {(error: any, result?: T) => void} [callback=null]
     * @returns {Promise<T>}
     */
    protected returnOne(promise: Promise<T>, callback: (error: any, result?: T) => void = null): Promise<T> {
        return promise
            .then(r => {
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                if (callback) {
                    callback(err);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 다수 작업에 대한 리턴 처리
     * 
     * @protected
     * @param {Promise<T[]>} promise
     * @param {(error: any, result?: T[]) => void} [callback=null]
     * @returns {Promise<T[]>}
     */
    protected returnMulti(promise: Promise<T[]>, callback: (error: any, result?: T[]) => void = null): Promise<T[]> {
        return promise
            .then(r => {
                if (callback) {
                    callback(null, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                if (callback) {
                    callback(err);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 갱신에 대한 처리 결과 반환
     * 
     * @protected
     * @param {Promise<T[]>} promise
     * @param {(err: any, affectedRows?: number, raw?: any) => void} [callback=null]
     * @returns {Promise<T[]>}
     */
    protected returnUpdate(promise: Promise<T[]>, callback: (err: any, affectedRows?: number, raw?: any) => void = null): Promise<T[]> {
        return promise
            .then(r => {
                if (callback) {
                    callback(null, r.length, r);
                    return;
                }
                return Promise.resolve(r);
            })
            .catch(err => {
                if (callback) {
                    callback(err);
                    return;
                }
                return Promise.reject(err);
            });
    }

    /**
     * 추가 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {*} item
     * @param {(error: any, result: T) => void} [callback=null]
     * @returns {Promise<T>}
     */
    create(item: any, callback: (error: any, result: T) => void = null): Promise<T> {
        return this.returnOne(this._create(item), callback);
    }

    /**
     * 실제 생성을 하는 로직 수행
     * 
     * @private
     * @param {*} item
     * @returns {Promise<T>}
     */
    private _create(item: any): Promise<T> {
        if (!item) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.create(item, (err: any, res: T) => {
                if (err) {
                    this.debugger(`create failed`);
                    this.debugger(err);
                    reject(err);
                    return;
                }
                this.debugger(`create succeed`);
                this.debugger(res);
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
    update(cond: any, item: T, callback: (err: any, affectedRows: number, raw: any) => void = null): Promise<T[]> {
        return this.returnUpdate(this._update(cond, item), callback);
    }

    /**
     * 갱신
     * 
     * @private
     * @param {*} cond
     * @param {T} update
     * @returns {Promise<T[]>}
     */
    private _update(cond: any, update: T): Promise<T[]> {
        if (!cond || !update) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.update(cond, update, (err: any, affectedRows: number, raw: any) => {
                if (err) {
                    this.debugger(`update failed`);
                    this.debugger(err);
                    reject(err);
                    return;
                }
                this.debugger(`update succeed`);
                this.debugger(affectedRows);
                this.debugger(raw);
                resolve(raw);
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
    updateOne(cond: Object, update: Object, callback: (error: any, result?: T) => void = null): Promise<T> {
        return this.returnOne(this._updateOne(cond, update), callback);
    }

    /**
     * 하나의 객체 갱신
     * 
     * @private
     * @param {Object} cond
     * @param {Object} update
     * @returns {Promise<T>}
     */
    private _updateOne(cond: Object, update: Object): Promise<T> {
        if (!cond || !update) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findOneAndUpdate(cond, update, (err, res) => {
                if (err) {
                    this.debugger(`updateOne failed`);
                    this.debugger(err);
                    reject(err);
                    return;
                }
                this.debugger(`updateOne succeed`);
                this.debugger(res);
                resolve(res);
                return;
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
    updateById(id: string, update: Object, callback: (error: any, result?: T) => void = null): Promise<T> {
        return this.returnOne(this._updateById(id, update), callback);
    }

    /**
     * 하나의 객체 갱신
     * 
     * @private
     * @param {string} id
     * @param {Object} update
     * @returns {Promise<T>}
     */
    private _updateById(id: string, update: Object): Promise<T> {
        if (!id || !update) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findByIdAndUpdate(id, update, (err, res) => {
                if (err) {
                    this.debugger(`updateById failed`);
                    this.debugger(err);
                    reject(err);
                    return;
                }
                this.debugger(`updateById succeed`);
                this.debugger(res);
                resolve(res);
                return;
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
        return this.returnOne(this._deleteOne(cond), callback);
    }

    /**
     * 
     * 
     * @private
     * @param {Object} cond
     * @returns {Promise<T>}
     */
    private _deleteOne(cond: Object): Promise<T> {
        if (!cond) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findOneAndRemove(cond, (err, res) => {
                if (err) {
                    this.debugger(`deleteOne failed`);
                    this.debugger(err);
                    reject(err);
                    return;
                }
                this.debugger(`deleteOne succeed`);
                this.debugger(res);
                resolve(res);
                return;
            });
        });
    }

    /**
     * 삭제 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} id
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<T>}
     */
    deleteById(id: string, callback: (error: any, result: any) => void = null): Promise<T> {
        return this.returnOne(this._deleteById(id), callback);
    }

    /**
     * 삭제
     * 
     * @private
     * @param {string} id
     * @returns {Promise<T>}
     */
    private _deleteById(id: string): Promise<T> {
        if (!id) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findByIdAndRemove(id, (err, res) => {
                if (err) {
                    this.debugger(`deleteById failed`);
                    this.debugger(err);
                    reject(err);
                    return;
                }
                this.debugger(`deleteById succeed`);
                this.debugger(res);
                resolve(res);
                return;
            });
        });
    }

    /**
     * 모든 객체 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {*} [cond={}]
     * @param {string} [filter]
     * @param {(error: any, result: T[]) => void} [callback=null]
     * @returns {Promise<T[]>}
     */
    findAll(cond: any = {}, filter?: string, callback: (error: any, result: T[]) => void = null): Promise<T[]> {
        return this.returnMulti(this._findAll(cond, filter), callback);
    }

    /**
     * 실제 모든 객체 검색을 수행하는 함수
     * 
     * @private
     * @param {*} [cond={}]
     * @param {string} [filter]
     * @returns {Promise<T[]>}
     */
    private _findAll(cond: any = {}, filter?: string): Promise<T[]> {
        return new Promise((resolve: any, reject: any) => {
            if (filter) {
                this._model.find(cond, filter, (err: any, res: T[]) => {
                    if (err) {
                        this.debugger(`findAll failed`);
                        this.debugger(err);
                        reject(err);
                        return;
                    }
                    this.debugger(`findAll succeed`);
                    this.debugger(res);
                    resolve(res);
                    return;
                });
            } else {
                this._model.find(cond, (err: any, res: T[]) => {
                    if (err) {
                        this.debugger(`findAll failed`);
                        this.debugger(err);
                        reject(err);
                        return;
                    }
                    this.debugger(`findAll succeed`);
                    this.debugger(res);
                    resolve(res);
                    return;
                });
            }
        });
    }

    /**
     * findOne
     * 
     * @param {*} cond
     * @param {string} [filter]
     * @param {(error: any, result?: any) => void} [callback=null]
     * @returns {Promise<T>}
     */
    findOne(cond: any, filter?: string, callback: (error: any, result?: any) => void = null): Promise<T> {
        return this.returnOne(this._findOne(cond, filter), callback);
    }

    /**
     * 실제 모든 객체 검색을 수행하는 함수
     * 
     * @private
     * @param {*} [cond]
     * @param {string} [filter='']
     * @returns {Promise<T>}
     */
    private _findOne(cond: any, filter?: string): Promise<T> {
        if (!cond) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            if (filter) {
                this._model.findOne(cond, filter, (err: any, res: T) => {
                    if (err) {
                        this.debugger(`findOne failed`);
                        this.debugger(err);
                        reject(err);
                        return;
                    }
                    this.debugger(`findOne succeed`);
                    this.debugger(res);
                    resolve(res);
                    return;
                });
            } else {
                this._model.findOne(cond, (err: any, res: T) => {
                    if (err) {
                        this.debugger(`findOne failed`);
                        this.debugger(err);
                        reject(err);
                        return;
                    }
                    this.debugger(`findOne succeed`);
                    this.debugger(res);
                    resolve(res);
                    return;
                });
            }
        });
    }

    /**
     * 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} id
     * @param {string} [filter]
     * @param {(error: any, result: any) => void} [callback=null]
     * @returns {Promise<T>}
     */
    findById(id: string, filter?: string, callback: (error: any, result: any) => void = null): Promise<T> {
        return this.returnOne(this._findById(id, filter), callback);
    }

    /**
     * ID 검색
     * 
     * @private
     * @param {string} id
     * @param {string} [filter]
     * @returns {Promise<T>}
     */
    private _findById(id: string, filter?: string): Promise<T> {
        if (!id) {
            return this.returnInvalidParams();
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findById(id, filter, (err: any, res: T) => {
                if (err) {
                    this.debugger(`findById failed`);
                    this.debugger(err);
                    reject(err);
                    return;
                }
                this.debugger(`findById succeed`);
                this.debugger(res);
                resolve(res);
                return;
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