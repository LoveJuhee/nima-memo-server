'use strict';

import mongoose = require('mongoose');
import {Promise} from 'es6-promise';

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
     * @param {(error: any, result: any) => void} callback
     */
    create(item: T, callback: (error: any, result: any) => void = null): Promise<Object> {
        if (callback) {
            this._model.create(item, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.create(item, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    /**
     * 갱신 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {mongoose.Types.ObjectId} _id
     * @param {T} item
     * @param {(error: any, result: any) => void} callback
     */
    update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void = null): Promise<Object> {
        if (callback) {
            this._model.update({ _id: _id }, item, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.update({ _id: _id }, item, (err: any, res: any) => {
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
     * @param {(error: any, result: any) => void} callback
     */
    delete(_id: string, callback: (error: any, result: any) => void = null): Promise<Object> {
        if (callback) {
            this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.remove({ _id: this.toObjectId(_id) }, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * 모든 객체 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {(error: any, result: any) => void} callback
     */
    findAll(callback: (error: any, result: any) => void = null): Promise<Object> {
        if (callback) {
            this._model.find({}, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.find({}, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    /**
     * 검색 (callback 객체가 없다면 Promise 라고 판단하고 대응한다.)
     * 
     * @param {string} _id
     * @param {(error: any, result: T) => void} callback
     */
    findById(_id: string, callback: (error: any, result: any) => void = null): Promise<Object> {
        if (callback) {
            this._model.findById(_id, callback);
            return;
        }
        return new Promise((resolve: any, reject: any) => {
            this._model.findById(_id, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
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
    private toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }
}