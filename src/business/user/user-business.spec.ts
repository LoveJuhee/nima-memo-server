'use strict';
import {preset} from '../../debug/spec-preset';

import AccountFactory from '../account/account-business';
import factory from './user-business';

import otherUtil from '../../util/other-util';

import {DEBUG_TDD_BUSINESS_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_TDD_BUSINESS_USER);

const ACCOUNT = {
    email: 'nima@gmail.com',
    password: 'nima1234',
    nickname: 'nima',
};

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

    it('User create', function (done: DoneFn) {
        factory.create({ email: 'e', nickname: 'nick' })
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.email).not.toBeNull();
                expect(r.nickname).not.toBeNull();
                return Promise.resolve();
            })
            .catch(err => {
                debug(err);
                return Promise.resolve();
            })
            .then(done);
    });

    it('Account & User create', function (done: DoneFn) {
        AccountFactory.create(ACCOUNT)
            // 성공 시 user 생성
            .then(r => {
                return factory.create(ACCOUNT)
            })
            // 성공 결과
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.email).not.toBeNull();
                expect(r.nickname).not.toBeNull();
                return Promise.resolve();
            })
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            .then(done);
    });

    it('User duplicate create', function (done: DoneFn) {
        factory.create(ACCOUNT)
            // 생성 성공 결과 (오류)
            .then(r => {
                debug(r);
                expect(r).toBeNull();
                return Promise.resolve();
            })
            // 생성 실패 (목표)
            .catch(err => {
                expect(err).not.toBeNull();
                return Promise.resolve();
            })
            .then(done);
    });

    it('User delete', function (done: DoneFn) {
        factory.deleteOne(ACCOUNT.email)
            // 생성 성공 결과 (목표)
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                return Promise.resolve();
            })
            // 생성 실패 (오류)
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            .then(() => {
                return AccountFactory.deleteOne(ACCOUNT);
            })
            .then(done);
    });

    it('User duplicate delete', function (done: DoneFn) {
        factory.deleteOne(ACCOUNT.email)
            // 생성 성공 결과 (오류)
            .then(r => {
                debug(r);
                expect(r).toBeNull();
                return Promise.resolve();
            })
            // 생성 실패 (목표)
            .catch(err => {
                debug(err);
                expect(err).not.toBeNull();
                return Promise.resolve();
            })
            .then(done);
    });

});