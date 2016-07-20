'use strict';

import {Mongo} from './mongo';
import {Sequelize} from './sequelize';

/**
 * Secrets
 */
class Secrets {
    constructor(session: string = 'secrets-item-key') {
        this.session = session;
    }

    /**
     * 세션 보안 키
     * 
     * @private
     * @type {string}
     */
    private _session: string = '';
    set session(session: string) {
        this._session = session;
    }
    get session(): string {
        return this._session;
    }

    /**
     * 토큰 유효 시간 (60, 5h, 12d, 7 days 등)
     * 
     * @private
     * @type {*}
     */
    private _expiresIn: any = 60 * 60 * 5;
    set expiresIn(expiresIn: any) {
        this._expiresIn = expiresIn;
    }
    get expiresIn(): any {
        return this._expiresIn;
    }
}

/**
 * Auth
 */
class Auth {
    /**
     * Client ID
     * 
     * @private
     * @type {string}
     */
    private _id: string;
    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    /**
     * Client Secret
     * 
     * @private
     * @type {string}
     */
    private _secret: string;
    set secret(secret: string) {
        this._secret = secret;
    }
    get secret(): string {
        return this._secret;
    }

    /**
     * Callback Url
     * 
     * @private
     * @type {string}
     */
    private _callbackUrl: string;
    set callbackUrl(callbackUrl: string) {
        this._callbackUrl = callbackUrl;
    }
    get callbackUrl(): string {
        return this._callbackUrl;
    }
}

/**
 * 시스템 설정
 * 
 * @export
 * @class Params
 */
export class Environment {
    /**
     * NODE_ENV 값
     * 
     * @private
     * @type {string}
     */
    private _env: string = process.env.NODE_ENV;
    set env(env: string) {
        this._env = env;
    }
    get env(): string {
        return this._env;
    }

    /**
     * root 경로
     * 
     * @private
     * @type {string}
     */
    private _root: string;
    set root(root: string) {
        this._root = root;
    }
    get root(): string {
        return this._root;
    }

    /**
     * 계정 권한
     * 
     * @private
     * @type {string[]}
     */
    private _userRoles: string[] = [];
    set userRoles(userRoles: string[]) {
        this._userRoles = userRoles;
    }
    get userRoles(): string[] {
        return this._userRoles;
    }

    /**
     * Session 보안 관련
     * 
     * @private
     * @type {Secrets}
     */
    private _secrets: Secrets = new Secrets();
    set secrets(secrets: Secrets) {
        this._secrets = secrets;
    }
    get secrets(): Secrets {
        return this._secrets;
    }

    /**
     * MongoDB
     * 
     * @private
     * @type {Mongo}
     */
    private _mongo: Mongo = new Mongo();
    set mongo(mongo: Mongo) {
        this._mongo = mongo;
    }
    get mongo(): Mongo {
        return this._mongo;
    }

    /**
     * Sequelize
     * 
     * @private
     * @type {Sequelize}
     */
    private _sequelize: Sequelize = new Sequelize();
    set sequelize(sequelize: Sequelize) {
        this._sequelize = sequelize;
    }
    get sequelize(): Sequelize {
        return this._sequelize;
    }

    /**
     * WAS ip
     * 
     * @private
     * @type {string}
     */
    private _ip: string;
    set ip(ip: string) {
        this._ip = ip;
    }
    get ip(): string {
        return this._ip;
    }

    /**
     * WAS port
     * 
     * @private
     * @type {Number}
     */
    private _port: Number;
    set port(port: Number) {
        this._port = port;
    }
    get port(): Number {
        return this._port;
    }

    /**
     * Seed DB 구성 여부 (기본 값: false)
     * 
     * @private
     * @type {boolean}
     */
    private _seedDB: boolean = false;
    set seedDB(seedDB: boolean) {
        this._seedDB = seedDB;
    }
    get seedDB(): boolean {
        return this._seedDB;
    }

    /**
     * Facebook 계정 연계
     * 
     * @private
     * @type {Auth}
     */
    private _facebook: Auth = new Auth();
    set facebook(facebook: Auth) {
        this._facebook = facebook;
    }
    get facebook(): Auth {
        return this._facebook;
    }

    /**
     * Twitter 계정 연계
     * 
     * @private
     * @type {Auth}
     */
    private _twitter: Auth = new Auth();
    set twitter(twitter: Auth) {
        this._twitter = twitter;
    }
    get twitter(): Auth {
        return this._twitter;
    }

    /**
     * Google 계정 연계
     * 
     * @private
     * @type {Auth}
     */
    private _google: Auth = new Auth();
    set google(google: Auth) {
        this._google = google;
    }
    get google(): Auth {
        return this._google;
    }

    toString() {
        return 'Params class';
    }
}