'use strict';

import {Schema, Document, HookNextFunction} from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

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

// 저장 이전에 할 동작
AccountSchema.pre('save', (next) => {
    // TODO: created_at 데이터 생성
    hashPassword(next);
});

// 업데이트 이전에 할 동작
AccountSchema.pre('findOneAndUpdate', (next) => {
    let user = this._update;
    if (!user.newPassword) {
        // newPassword 가 없다면 갱신이 없다고 판단한다.
        return next();
    }
    // TODO: updated_at 데이터 생성
    user.password = user.newPassword;
    hashPassword(next);
});

/**
 * hash 생성
 * 
 * @param {HookNextFunction} next
 * @returns
 */
function hashPassword(next: HookNextFunction) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
}
