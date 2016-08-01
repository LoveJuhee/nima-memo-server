'use strict';

import * as mongoose  from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

import {DEBUG_MODEL_SERVER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_MODEL_SERVER);

export interface IServer {
    name: String;
    ip: String;
    createdAt: Date;
    updatedAt: Date;
};

export interface IServerModel extends IServer, mongoose.Document { };

export let ServerSchema = new mongoose.Schema({
    name: String,
    ip: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

ServerSchema.path('name')
    .validate(function (name: String): boolean {
        debug(`ServerSchema.name validate check (${name})`);
        return !(!name);
    }, 'name cannot be blank');

ServerSchema.path('ip')
    .validate(function (ip: String, respond: (res: boolean) => void): any {
        ServerModel.findOne({ ip }, (err, res) => {
            if (err) {
                debug(err);
                throw err;
            }
            return respond(!res);
        });
    }, 'The specified ip is already in use.');

/**
 * Pre-save hook
 */
ServerSchema.pre('save', function (next: mongoose.HookNextFunction) {
    next();
});

/**
 * Pre-updateOn hook
 */
ServerSchema.pre('updateOn', preUpdate);

/**
 * update 작업에 대한 함수
 * 
 * @param {mongoose.HookNextFunction} next
 */
function preUpdate(next: mongoose.HookNextFunction) {
    if (this && this._update) {
        this._update.updatedAt = new Date();
    } else {
        debug(`function preUpdate(next: mongoose.HookNextFunction) error`);
        debug(this);
    }
    next();
}

/**
 * 모델 객체 생성
 */
let ServerModel: mongoose.Model<IServerModel>;
ServerModel = mongoose.model<IServerModel>('Server', ServerSchema);
export default ServerModel;