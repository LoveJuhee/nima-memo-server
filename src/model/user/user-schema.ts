'use strict';

import {Schema, Document, HookNextFunction} from 'mongoose';

export interface IUser {
    email: String;
    nickname: String;
    name: String;
    rules: [String];
    location: String;
    meta: {
        website: String;
    };
    created_at: Date;
    updated_at: Date;
};

export interface IUserModel extends IUser, Document { };

/**
 * User 스키마
 */
export let UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true, unique: true },
    name: String,
    rules: [String],
    location: String,
    meta: {
        website: String
    },
    created_at: Date,
    updated_at: Date
});

// 저장 이전에 할 동작
UserSchema.pre('save', (next) => {
    // TODO: created_at 데이터 생성
});

// 업데이트 이전에 할 동작
UserSchema.pre('findOneAndUpdate', (next) => {
    // TODO: updated_at 데이터 생성
});
