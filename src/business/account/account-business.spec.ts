'use strict';
import {preset} from '../../debug/spec-preset';

import AccountFactory from '../../model/account/account';
import AccountBusiness from './account-business';

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
        AccountFactory.create(promiseAccount, (err, res) => {
            if (err) {
                debug(`AccountFactory.create: failed`);
                debug(err);
                expect(err).toBeNull();
                done();
            }
            business.create(res)
                .then(res => {
                    console.log(`business.create() done.`);
                    return otherUtil.print(res);
                })
                .then(() => {
                    console.log(`try delete item`);
                    return business.deleteOne(promiseAccount);
                })
                .then(res => {
                    console.log(`business.deleteOne() done.`);
                    return otherUtil.print(res);
                })
                .catch(otherUtil.print)
                .then(done);
        });
    });

    it('promise insert test', function (done: DoneFn) {
        AccountFactory.create(promiseAccount, (err, res) => {
            if (err) {
                debug(`AccountFactory.create: failed`);
                debug(err);
                expect(err).toBeNull();
                done();
            }
            business.create(res)
                .catch(otherUtil.print)
                .then(done);
        });
    });

    it('promise find email test', function (done: DoneFn) {
        business.findByEmail(promiseAccount.email)
            .then(r => {
                expect(r).toBeDefined();
                expect(r.email).toBe(promiseAccount.email);
                expect(r.password).toBe(promiseAccount.password);
                return Promise.resolve(r);
            })
            .catch(otherUtil.print)
            .then(done);
    });

    it('promise update password test', function (done: DoneFn) {
        console.log(`try update account: ${promiseAccountUpdate.password}`);
        business.updateOne(promiseAccount, promiseAccountUpdate)
            .then(otherUtil.print)
            .catch(otherUtil.print)
            .then(() => {
                console.log(`try find account: ${promiseAccount.email}`);
                return business.findByEmail(promiseAccount.email);
            })
            .then(r => {
                expect(r.email).toBe(promiseAccountUpdate.email);
                expect(r.password).toBe(promiseAccountUpdate.password);
                return otherUtil.print(r);
            })
            .catch(otherUtil.print)
            .then(done);
    });

    it('promise delete email test', function (done: DoneFn) {
        console.log(`try delete account: ${promiseAccountUpdate.email}`);
        business.deleteOne(promiseAccountUpdate)
            .catch(otherUtil.print)
            .then(() => {
                console.log(`try find account: ${promiseAccountUpdate.email}`);
                return business.findByEmail(promiseAccountUpdate.email);
            })
            .then(r => {
                expect(r).toBeNull();
                return Promise.resolve();
            })
            .catch(otherUtil.print)
            .then(() => {
                console.log(`try delete item`);
                return business.deleteOne(promiseAccountUpdate);
            })
            .then(otherUtil.print)
            .catch(otherUtil.print)
            .then(done);
    });
});