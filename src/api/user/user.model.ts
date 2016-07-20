'use strict';

import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

import {DEBUG_MODEL_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_MODEL_USER);

const authTypes = ['github', 'twitter', 'facebook', 'google'];
const DEFAULT_SOLT_BYTE_SIZE = 16;

export interface IUser {
    name: String;
    nick: String;
    location: String;
    email: String;
    role: String;
    pint: Number;
    password: String;
    provider: String;
    salt: String;
    created_at: Date;
    updated_at: Date;
    facebook: {};
    twitter: {};
    google: {};
    github: {};
};

export interface IUserModel extends IUser, mongoose.Document { };

/**
 * User 스키마
 */
export let UserSchema = new mongoose.Schema({
    name: String,
    nick: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        index: { unique: true }
    },
    role: {
        type: String,
        default: 'user'
    },
    pint: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    provider: String,
    salt: String,
    location: {
        type: String,
        default: 'en'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    facebook: {},
    twitter: {},
    google: {},
    github: {}
});

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual('profile')
    .get(function () {
        return {
            'name': this.name,
            'role': this.role
        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token')
    .get(function () {
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/**
 * Validations
 */

// Validate empty email
UserSchema.path('email')
    .validate(function (email: string): number | boolean {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return email.length;
    }, 'Email cannot be blank');

// Validate empty password
UserSchema.path('password')
    .validate(function (password: string): number | boolean {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return password.length;
    }, 'Password cannot be blank');

// Validate email is not taken
UserSchema.path('email')
    .validate(function (value: string, respond: (res: boolean) => void): any {
        let self = this;
        UserModel.findOne({ email: value }, (err, res) => {
            if (err) {
                debug(err);
                throw err;
            }
            if (res && self.id !== res.id) {
                return respond(false);
            }
            return respond(true);
        });
    }, 'The specified email address is already in use.');

// Validate nick is not taken
UserSchema.path('nick')
    .validate(function (value: string, respond: (res: boolean) => void): any {
        let self = this;
        UserModel.findOne({ nick: value }, (err, res) => {
            if (err) {
                debug(err);
                throw err;
            }
            if (res && self.id !== res.id) {
                return respond(false);
            }
            return respond(true);
        });
    }, 'The specified nick is already in use.');


/**
 * 객체 유효성 체크
 * 
 * @param {string} value
 * @returns {Number}
 */
function validatePresenceOf(value: string): Number {
    return value && value.length;
};

/**
 * Pre-findOneAndUpdate hook
 */
UserSchema.pre('findOneAndUpdate', function (next: mongoose.HookNextFunction) {
    this._update.updated_at = new Date();
    debug(this._update);
    next();
});

/**
 * Pre-updateOne hook
 */
UserSchema.pre('updateOne', function (next: mongoose.HookNextFunction) {
    this._update.updated_at = new Date();
    debug(this._update);
    next();
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next: mongoose.HookNextFunction) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
        return next();
    }

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
        next(new Error('Invalid password'));
    }

    this.created_at = this.created_at || new Date();
    this.updated_at = new Date();
    debug(this);

    // Make salt with a callback
    this.makeSalt(DEFAULT_SOLT_BYTE_SIZE, (saltErr, salt) => {
        if (saltErr) {
            next(saltErr);
        }
        this.salt = salt;
        this.encryptPassword(this.password, (encryptErr: any, hashedPassword: string) => {
            if (encryptErr) {
                next(encryptErr);
            }
            this.password = hashedPassword;
            next();
        });
    });
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {string} password
     * @param {(err: any, res: boolean) => void} [callback=null]
     * @returns {(boolean | void)}
     */
    authenticate(password: string, callback: (err: any, res: boolean) => void = null): boolean | void {
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }

        this.encryptPassword(password, (err: any, pwdGen: string) => {
            if (err) {
                return callback(err, null);
            }

            if (this.password === pwdGen) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    },

    /**
     * Make salt
     *
     * @param {number} [byteSize=DEFAULT_SOLT_BYTE_SIZE] byteSize Optional salt byte size, default to 16
     * @param {(err: any, res: string) => void} [callback=null]
     * @returns {(string | void)}
     */
    makeSalt(byteSize: number = DEFAULT_SOLT_BYTE_SIZE, callback: (err: any, res: string) => void = null): string | void {
        if (!callback) {
            return crypto
                .randomBytes(byteSize)
                .toString('base64');
        }

        return crypto.randomBytes(byteSize, (err, salt) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, salt.toString('base64'));
            }
        });
    },

    /**
     * Encrypt password
     *
     * @param {string} password
     * @param {(err: any, res: string) => void} [callback=null]
     * @returns {(string | void)}
     */
    encryptPassword(password: string, callback: (err: any, res: string) => void = null): string | void {
        if (!password || !this.salt) {
            return null;
        }

        const DEFAULT_ITERATIONS = 10000;
        const DEFAULT_KEY_LENGTH = 64;
        let salt = new Buffer(this.salt, 'base64');

        if (!callback) {
            return crypto
                .pbkdf2Sync(password, salt, DEFAULT_ITERATIONS, DEFAULT_KEY_LENGTH)
                .toString('base64');
        }

        return crypto.pbkdf2(password, salt, DEFAULT_ITERATIONS, DEFAULT_KEY_LENGTH, (err, key) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, key.toString('base64'));
            }
        });
    }
};

/**
 * 모델 객체 생성
 */
let UserModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);
export default UserModel;