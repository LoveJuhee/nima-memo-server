'use strict';
import {preset} from '../../debug/spec-preset';

import AccountFactory from '../../model/account/account';
import {AccountBusiness} from './account-business';

import otherUtil from '../../util/other-util';

import {LOGGING_TDD_BUSINESS_ACCOUNT} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_TDD_BUSINESS_ACCOUNT);

let callbackAccount = {
    email: 'callback@gmail.com',
    password: '123456789',
};
let promiseAccount = {
    email: 'promise@gmail.com',
    password: 'abcdefg',
};
let promiseAccountUpdate = {
    email: promiseAccount.email,
    password: '123456789',
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

    it('callback insert & delete test', function (done: DoneFn) {
        debug(`===== callback insert & delete test =====`);
        let user = AccountFactory.create(callbackAccount, (err, res) => {
            if (err) {
                debug(`AccountFactory.create: failed`);
                debug(err);
                expect(err).toBeNull();
                done();
            }
            business.create(res, (err, result) => {
                if (err) {
                    debug(`business.create: failed`);
                    debug(err);
                    expect(err).toBeNull();
                    done();
                }
                debug(`business.create: success`);
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
                    debug(`business.delete: success`);
                    debug(result);
                    expect(result).toBeNull();
                    done();
                });
            });
        });
    });

    it('promise insert & delete test', function (done: DoneFn) {
        debug('===== promise insert & delete test =====');
        business.create(promiseAccount)
            .then(r => {
                debug(`business.create success`);
                debug(r);
                return business.deleteOne(promiseAccount);
            })
            .catch(r => {
                debug(`business.create failed`);
                debug(r);
                done();
            })
            .then(r => {
                debug(`business.delete success`);
                debug(r);
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.delete failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(done);
    });

    it('promise insert test', function (done: DoneFn) {
        debug(`===== promise insert test =====`);
        business.create(promiseAccount)
            .then(r => {
                debug(`business.create success`);
                debug(r);
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.create failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(done);
    });

    it('promise find email test', function (done: DoneFn) {
        debug(`===== promise find email test =====`);
        business.findByEmail(promiseAccount.email)
            .then(r => {
                debug(`business.findByEmail success`);
                debug(r);
                expect(r).toBeDefined();
                expect(r.email).toBe(promiseAccount.email);
                expect(r.password).toBe(promiseAccount.password);
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.findByEmail failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(done);
    });

    it('promise update password test', function (done: DoneFn) {
        debug(`===== promise update password test =====`);
        business.updateOne(promiseAccount, promiseAccountUpdate)
            .then(r => {
                debug(`business.update success`);
                debug(r);
                return business.findByEmail(promiseAccount.email);
            })
            .catch(r => {
                debug(`business.update failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(r => {
                debug(`business.findByEmail success`);
                debug(r);
                expect(r.email).toBe(promiseAccountUpdate.email);
                expect(r.password).toBe(promiseAccountUpdate.password);
                return Promise.resolve(r);
            })
            .catch(r => {
                debug(`business.findByEmail failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(done);
    });

    it('promise delete email test', function (done: DoneFn) {
        debug(`===== promise delete email test =====`);
        business.deleteOne(promiseAccountUpdate)
            .then(r => {
                debug(`business.delete success`);
                debug(r);
                expect(r).not.toBeNull();
                return business.findByEmail(promiseAccountUpdate.email);
            })
            .catch(r => {
                debug(`business.delete failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(r => {
                debug(`business.findByEmail success`);
                debug(r);
                expect(r).toBeNull();
                return Promise.resolve();
            })
            .catch(r => {
                debug(`business.findByEmail failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(() => {
                debug(`try delete item`);
                return business.deleteOne(promiseAccountUpdate);
            })
            .then(r => {
                debug(`business.delete success`);
                debug(r);
                expect(r).toBeNull();
                return business.findByEmail(promiseAccountUpdate.email);
            })
            .catch(r => {
                debug(`business.delete failed`);
                debug(r);
                return Promise.resolve(r);
            })
            .then(done);
    });
});