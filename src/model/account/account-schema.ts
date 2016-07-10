'use strict';

import * as mongoose  from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

export interface IAccount {
    email: String;
    password: String;
    created_at: Date;
    updated_at: Date;
};

export interface IAccountModel extends IAccount, mongoose.Document { };

export let AccountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: Date,
    updated_at: Date
});
