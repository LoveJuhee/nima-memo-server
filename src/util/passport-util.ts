'use strict';
import * as bcrypt from 'bcrypt-nodejs';

import {LOGGING_UTIL_PASSPORT} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_UTIL_PASSPORT);

/**
 * 
 * 
 * @class PassportUtil
 */
class PassportUtil {
    /**
     * 암호화 처리 
     * 
     * @param {string} password
     * @returns {string}
     */
    generateHash(password: string): string {
        let hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        debug(`password(${password}) => hash(${hash})`);
        return hash;
    };

    /**
     * 암호 동일 여부 확인
     * 
     * @param {string} password
     * @param {string} password2
     * @returns {boolean}
     */
    validPassword(password: string, password2: string): boolean {
        return bcrypt.compareSync(password, password2);
    };

}

const passportUtil: PassportUtil = new PassportUtil();
export default passportUtil;