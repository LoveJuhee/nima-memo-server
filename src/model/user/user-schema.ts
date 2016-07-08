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
