'use strict';
import {preset} from '../../debug/spec-preset';

import UserFactory from '../../model/user/user';
import UserBusiness from './user-business';

import otherUtil from '../../util/other-util';

import {LOGGING_TDD_BUSINESS_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_TDD_BUSINESS_USER);

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

    xit('callback insert & delete test', function (done: DoneFn) {
        let user = UserFactory.create({ name: 'a1', email: 'b1', password: 'c1' }, (err, res) => {
            if (err) {
                debug(`UserFactory.create: failed`);
                debug(err);
                expect(err).toBeNull();
                done();
            }
            let business: UserBusiness = new UserBusiness();
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

    xit('promise insert & delete test', function (done: DoneFn) {
        UserFactory.create({ name: 'a2', email: 'b2', password: 'c2' }, (err, res) => {
            if (err) {
                debug(`UserFactory.create: failed`);
                debug(err);
                expect(err).toBeNull();
                done();
            }
            let business: UserBusiness = new UserBusiness();

            business.create(res)
                .then(otherUtil.print)
                .then(r => {
                    let _id: string = r['_id'] + '';
                    debug(`_id: ${_id}, _id.length: ${_id.length}`);
                    return business.delete(_id);
                })
                .catch(otherUtil.print)
                .then(done);
        });
    });
});