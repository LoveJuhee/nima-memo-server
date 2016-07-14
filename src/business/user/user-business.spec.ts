'use strict';
import {preset} from '../../debug/spec-preset';

import AccountFactory from '../account/account-business';
import factory from './user-business';

import otherUtil from '../../util/other-util';

import {DEBUG_TDD_BUSINESS_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_TDD_BUSINESS_USER);

describe('UserBusiness TDD', function () {
    beforeEach(function (done: DoneFn) {
        preset.db.connect()
            .then(() => { return otherUtil.print('connected'); })
            .then(done)
            .catch(otherUtil.print)
            .then(done);
    });

    afterEach(function (done: DoneFn) {
        // DB의 경우 다른 테스트에서 활용하는 경우가 많아서 대기를 걸어줘야 오류가 발생하지 않는다.
        setTimeout(() => {
            preset.db.disconnect()
                .then(done)
                .catch(done);
        }, 1000);
    });

    it('callback insert & delete test', function (done: DoneFn) {
        factory.create({ email: 'e', nickname: 'nick' })
            .then(r => {
                debug(r);
                return Promise.resolve();
            })
            .catch(err => {
                debug(err);
                return Promise.resolve();
            })
            .then(done);
    });
});