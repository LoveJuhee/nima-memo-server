'use strict';

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

export interface IUser {
    name: String;
    email: String;
    password: String;
    admin: Boolean;
    location: String;
    meta: {
        age: Number;
        website: String;
    };
    created_at: Date;
    updated_at: Date;
};

export interface IUserModel extends IUser, mongoose.Document { };

/**
 * User 스키마
 */
export let UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    location: String,
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date
});

/**
 * 암호화 처리 
 */
UserSchema.methods.generateHash = function (password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

/**
 * 암호 동일 여부 확인
 */
UserSchema.methods.validPassword = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password);
};
