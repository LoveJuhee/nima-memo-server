'use strict';
import {Database} from './db';

/**
 * OptionsDefine
 */
class OptionsDefine {
    constructor(timestamps: boolean = false) {
        this.timestamps = timestamps;
    }

    private _timestamps: boolean;
    set timestamps(timestamps: boolean) {
        this._timestamps = timestamps;
    }
    get timestamps(): boolean {
        return this._timestamps;
    }
}

/**
 * Options
 */
class Options {
    private _logging: boolean = false;
    set logging(logging: boolean) {
        this._logging = logging;
    }
    get logging(): boolean {
        return this._logging;
    }

    private _storage: string = 'dist.sqlite';
    set storage(storage: string) {
        this._storage = storage;
    }
    get storage(): string {
        return this._storage;
    }

    private _define: OptionsDefine = new OptionsDefine();
    set define(define: OptionsDefine) {
        this._define = define;
    }
    get define(): OptionsDefine {
        return this._define;
    }
}

/**
 * Sequelize 클래스
 * 
 * @export
 * @class Sequelize
 * @extends {Database}
 */
export class Sequelize extends Database {
    private _options: Options = new Options();
    set options(options: Options) {
        this._options = options;
    }
    get options(): Options {
        return this._options;
    }
}