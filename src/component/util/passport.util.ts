'use strict';

import * as bcrypt from 'bcrypt-nodejs';

import {DEBUG_UTIL_PASSPORT} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_UTIL_PASSPORT);

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
     * @param {string} password  스트링 문자열
     * @param {(string | String)} hash 암호화 처리 문자열
     * @returns {boolean}
     */
    isValidPassword(password: string, hash: string | String): boolean {
        return bcrypt.compareSync(password, hash + '');
    };

}

const passportUtil: PassportUtil = new PassportUtil();
export default passportUtil;