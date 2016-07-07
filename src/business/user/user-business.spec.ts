'use strict';
import {preset} from '../../debug/spec-preset';
import UserBusiness from './user-business';
import RequestUtil from '../../util/request-util';

describe('UserBusiness Test', function () {
    beforeEach(function (done: MochaDone) {
        preset.db.connect()
            .then(done)
            .catch(RequestUtil.print)
            .then(done);
    });

    it('insert test', function () {
    });
});