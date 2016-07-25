'use strict';

import nodeUtil = require('util');

class ObjectUtil {
    /**
     * 객체 분리
     * 
     * @param {*} object
     * @param {boolean} [showHidden]
     * @param {number} [depth]
     * @param {boolean} [color]
     * @returns {string}
     */
    inspect(object: any, showHidden?: boolean, depth?: number, color?: boolean): string {
        return nodeUtil.inspect(object, showHidden, depth, color);
    }

    /**
     * 상속 클래스 등에 사용하는 객체 복제
     * 
     * @param {*} source
     * @param {*} target
     */
    copyProperties(source: any, target: any): void {
        for (var prop in source) {
            if (target[prop] !== undefined) {
                target[prop] = source[prop];
            } else {
                console.error(`Cannot set undefined property: ${prop}`);
            }
        }
    }
}

const factory: ObjectUtil = new ObjectUtil();
export default factory;