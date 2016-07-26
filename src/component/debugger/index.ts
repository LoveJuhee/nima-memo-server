'use strict';

import {DEBUG} from '../../config/logger';
import * as debug from 'debug';

/**
 * 공통 디버그 클래스
 * 
 * @export
 * @class Debugger
 * @template T
 */
export class Debugger {
    private _debugger: debug.IDebugger;

    /**
     * Creates an instance of Debugger.
     * 
     * @param {string} [debugKey=DEBUG]
     */
    constructor(debugKey: string = DEBUG) {
        this._debugger = debug(debugKey);
    }

    /**
     * 디버그 객체
     * 
     * @readonly
     * @type {debug.IDebugger}
     */
    get debugger(): debug.IDebugger {
        return this._debugger;
    }
}

/**
 * 클래스를 사용하지 않고 처리를 하는 팩토리
 */
const factory = new Debugger();
export default factory;