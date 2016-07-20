'use strict';
import {Database} from './db';

export class Mongo extends Database {
    /**
     * MongoDB Options
     * 
     * @private
     * @type {Options}
     */
    private _options: any = {};
    set options(options: any) {
        this._options = options;
    }
    get options(): any {
        return this._options;
    }

    toString() {
        return 'Mongo class';
    }
}