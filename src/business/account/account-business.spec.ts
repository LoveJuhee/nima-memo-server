'use strict';
import {preset} from '../../debug/spec-preset';

import AccountFactory from '../../model/account/account';
import {AccountBusiness} from './account-business';

import otherUtil from '../../util/other-util';
import passportUtil from '../../util/passport-util';

import {DEBUG_TDD_BUSINESS_ACCOUNT} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_TDD_BUSINESS_ACCOUNT);

let callbackAccount = {
    email: 'callback@gmail.com',
    password: '123456789',
};
let accountNewer = {
    email: 'promise@gmail.com',
    password: 'abcdefg',
};
let accountTryUpdate = {
    email: accountNewer.email,
    password: accountNewer.password,
    newPassword: '123456789',
};
let accountUpdated = {
    email: 'promise@gmail.com',
    password: accountTryUpdate.newPassword,
};

let business: AccountBusiness = new AccountBusiness();

describe('AccountBusiness TDD', function () {
    beforeEach(function (done: DoneFn) {
        preset.db.connect()
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

    it('check variable', function (done: DoneFn) {
        let s1: string = '';
        let s2: string = 'a';
        expect(!s1).toBeTruthy();
        expect(!s2).toBeFalsy();
        done();
    });

    it('callback insert & delete test', function (done: DoneFn) {
        debug(`===== callback insert & delete test =====`);
        business.create(callbackAccount, (err, result) => {
            if (err) {
                debug(`business.create: failed`);
                debug(err);
                expect(err).toBeNull();
                done();
            }
            debug(`business.create: succeed`);
            debug(result);
            expect(result).not.toBeNull();
            debug(typeof result._id);
            let _id: string = result._id + '';
            debug(`_id.length: ${_id.length}`);
            business.delete(_id, (err, result) => {
                if (err) {
                    debug(`business.delete: failed`);
                    debug(err);
                    expect(err).toBeNull();
                    done();
                }
                debug(`business.delete: succeed`);
                debug(result);
                expect(result).toBeNull();
                done();
            });
        });
    });

    it('promise insert & delete test', function (done: DoneFn) {
        debug('===== promise insert & delete test =====');
        debug(`try business.create`);
        business.create(accountNewer)
            .then(r => {
                debug(`business.create succeed`);
                debug(r);
                return Promise.resolve(null);
            })
            .catch(r => {
                debug(`business.create failed`);
                debug(r.errmsg);
                return Promise.resolve(null);
            })
            // delete 로직 수행
            .then(() => {
                debug(`try business.deleteOne`);
                return business.deleteOne(accountNewer);
            })
            .then(r => {
                debug(`business.delete succeed`);
                debug(r);
                expect(r).not.toBeNull();
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.delete failed`);
                debug(r.errmsg);
                return Promise.resolve(r);
            })
            // 종료 로직 수행
            .then(done);
    });

    it('promise insert test', function (done: DoneFn) {
        debug(`===== promise insert test =====`);
        business.create(accountNewer)
            .then(r => {
                debug(`business.create succeed`);
                debug(r);
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.create failed`);
                debug(r.errmsg);
                return Promise.resolve(r);
            })
            // 종료 로직 수행
            .then(done);
    });

    it('promise findOne test', function (done: DoneFn) {
        debug(`===== promise findOne test =====`);
        business.findOne(accountNewer)
            .then(r => {
                debug(`business.findOne succeed`);
                debug(r);
                expect(r).toBeDefined();
                expect(r.email).toBe(accountNewer.email);
                expect(passportUtil.isValidPassword(accountNewer.password, r.password + '')).toBeTruthy();
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.findOne failed`);
                debug(r.errmsg);
                return Promise.resolve(r);
            })
            // 종료 로직 수행
            .then(done);
    });

    it('promise findByEmail test', function (done: DoneFn) {
        debug(`===== promise findByEmail test =====`);
        business.findByEmail(accountNewer.email)
            .then(r => {
                debug(`business.findByEmail succeed`);
                debug(r);
                expect(r).toBeDefined();
                expect(r.email).toBe(accountNewer.email);
                expect(passportUtil.isValidPassword(accountNewer.password, r.password + '')).toBeTruthy();
                expect(passportUtil.isValidPassword(accountUpdated.password, r.password + '')).toBeFalsy();
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.findByEmail failed`);
                debug(r);
                return Promise.resolve(r);
            })
            // 종료 로직 수행
            .then(done);
    });

    it('promise update password test', function (done: DoneFn) {
        debug(`===== promise update password test =====`);
        business.updateOne(accountTryUpdate)
            .then(r => {
                debug(`business.update succeed`);
                debug(r);
                expect(r).toBeDefined();
                expect(r.email).toBe(accountNewer.email);
                expect(passportUtil.isValidPassword(accountUpdated.password, r.password + '')).toBeFalsy();
                expect(passportUtil.isValidPassword(accountNewer.password, r.password + '')).toBeTruthy();
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.update failed`);
                debug(r.errmsg);
                return Promise.resolve(r);
            })
            // 갱신된 정보 검색
            .then(() => {
                return business.findOne(accountUpdated);
            })
            .then(r => {
                debug(`business.findOne succeed`);
                debug(r);
                expect(passportUtil.isValidPassword(accountUpdated.password, r.password + '')).toBeTruthy('changed password check');
                expect(passportUtil.isValidPassword(accountNewer.password, r.password + '')).toBeFalsy('older password check');
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.findOne failed`);
                debug(r.errmsg);
                return Promise.resolve(r);
            })
            // 종료 로직 수행
            .then(done);
    });

    it('promise delete email test', function (done: DoneFn) {
        debug(`===== promise delete email test =====`);
        business.deleteOne(accountUpdated)
            .then(r => {
                debug(`business.delete succeed`);
                debug(r);
                expect(r).not.toBeNull();
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.delete failed`);
                debug(r.errmsg);
                return Promise.resolve(r);
            })
            // 삭제된 정보 검색
            .then(() => {
                return business.findByEmail(accountUpdated.email);
            })
            .then(r => {
                debug(`business.findByEmail succeed`);
                debug(r);
                expect(r).toBeNull();
                return Promise.resolve();
            })
            .catch(r => {
                debug(`business.findByEmail failed`);
                debug(r.errmsg);
                return Promise.resolve(r);
            })
            // 다시 삭제 시도
            .then(() => {
                debug(`retry delete item`);
                return business.deleteOne(accountUpdated);
            })
            .then(r => {
                debug(`business.delete succeed`);
                debug(r);
                expect(r).toBeNull();
                return business.findByEmail(accountUpdated.email);
            })
            .catch(r => {
                debug(`business.delete failed`);
                debug(r);
                return Promise.resolve(r);
            })
            // 종료
            .then(done);
    });
});