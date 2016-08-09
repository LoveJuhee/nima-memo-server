'use strict';

import * as mongoose  from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

import {DEBUG_MODEL_MEMO} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_MODEL_MEMO);

export interface IMemo {
    title: String;
    message: String;
    ownerId: String;
    createdAt: Date;
    updatedAt: Date;
};

export interface IMemoModel extends IMemo, mongoose.Document { };

export let MemoSchema = new mongoose.Schema({
    title: String,
    message: String,
    ownerId: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

/**
 * Pre-save hook
 */
MemoSchema.pre('save', function (next: mongoose.HookNextFunction) {
    next();
});

/**
 * Pre-updateOn hook
 */
MemoSchema.pre('updateOn', preUpdate);

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
let MemoModel: mongoose.Model<IMemoModel>;
MemoModel = mongoose.model<IMemoModel>('Memo', MemoSchema);
export default MemoModel;