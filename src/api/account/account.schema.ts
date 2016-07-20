'use strict';

import {Schema, Document, HookNextFunction} from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

import {DEBUG_MODEL_ACCOUNT} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_MODEL_ACCOUNT);

export interface IAccount {
    email: String;
    password: String;
    created_at: Date;
    updated_at: Date;
};

export interface IAccountModel extends IAccount, Document { };

export let AccountSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: Date,
    updated_at: Date
});

/** 저장 이전에 할 동작 */
AccountSchema.pre('save', preSaveProcess);

/** 업데이트 이전에 할 동작 */
AccountSchema.pre('findOneAndUpdate', function (next: HookNextFunction) {
    debug(`AccountSchema.pre('findOneAndUpdate')`);
    debug(this);
    var user = this._update;
    if (!user.newPassword) {
        delete user.password;
        return next();
    } else {
        // TODO: updated_at 데이터 생성
        user.password = bcrypt.hashSync(user.newPassword);
        return next();
    }
});

/**
 * hash 생성
 * 
 * @param {HookNextFunction} next
 * @returns
 */
function preSaveProcess(next: HookNextFunction) {
    debug(`AccountSchema.pre('save').preSaveProcess()`);
    debug(this);
    var user = this;
    if (!user.isModified('password')) {
        return next();
    } else {
        // TODO: created_at 데이터 생성
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
}
