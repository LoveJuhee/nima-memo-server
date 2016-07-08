'use strict';
import {preset} from '../../debug/spec-preset';
import User from '../../model/user/user';
import UserBusiness from './user-business';

import otherUtil from '../../util/other-util';

describe('UserBusiness TDD', function () {
    beforeEach(function (done: DoneFn) {
        preset.db.connect()
            .then(() => { return otherUtil.print('connected'); })
            .then(done)
            .catch(otherUtil.print)
            .then(done);
    });

    afterEach(function (done: DoneFn    ) {
        // DB의 경우 다른 테스트에서 활용하는 경우가 많아서 대기를 걸어줘야 오류가 발생하지 않는다.
        setTimeout(() => {
            preset.db.disconnect()
                .then(done)
                .catch(done);
        }, 3000);
    });

    it('insert test', function (done: DoneFn) {
        let user = User.create({ name: 'a1', email: 'b1', password: 'c1' }, (err, res) => {
            if (err) {
                console.error(`User.create: failed`);
                console.error(err);
                expect(err).toBeNull();
                done();
            }
            let business: UserBusiness = new UserBusiness();
            business.create(res, (err, result) => {
                if (err) {
                    console.error(`business.create: failed`);
                    console.error(err);
                    expect(err).toBeNull();
                    done();
                }
                console.error(`business.create: success`);
                console.log(result);
                expect(result).not.toBeNull();
                done();
            });
        });
    });
});