'use strict';
import {preset} from '../../debug/spec-preset';

import AccountFactory from '../account/account-business';
import factory from './user-business';

import otherUtil from '../../util/other-util';

import {DEBUG_TDD_BUSINESS_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_TDD_BUSINESS_USER);

const ACCOUNT_MOCK: any = {
    email: 'nima@gmail.com',
    password: 'nima1234',
    nickname: 'nima',
};
const USER_TRY_UPDATE: any = {
    email: ACCOUNT_MOCK.email,
    password: ACCOUNT_MOCK.password,
    nickname: 'updater',
};

describe('UserBusiness TDD', function () {
    beforeEach(function (done: DoneFn) {
        preset.db.connect()
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
        }, 100);
    });

    it('계정이 없는 유저 생성 시도', function (done: DoneFn) {
        debug(`계정이 없는 유저 생성 시도`);
        factory.create({ email: 'e', nickname: 'nick' })
            // 생성 성공 (오류)
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
            .then(done)
            .catch(done);
    });

    it('계정과 유저 생성 시도', function (done: DoneFn) {
        debug(`계정과 유저 생성 시도`);
        AccountFactory.create(ACCOUNT_MOCK)
            // 성공 시 user 생성
            .then(r => {
                return factory.create(ACCOUNT_MOCK);
            })
            // 생성 성공 (목표)
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.email).not.toBeNull();
                expect(r.email).toBe(ACCOUNT_MOCK.email);
                expect(r.nickname).not.toBeNull();
                expect(r.nickname).toBe(ACCOUNT_MOCK.nickname);
                return Promise.resolve();
            })
            // 생성 실패 (오류)
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            // 종료처리
            .then(done)
            .catch(done);
    });

    it('중복된 이메일 유저 생성 시도', function (done: DoneFn) {
        debug(`중복된 이메일 유저 생성 시도`);
        factory.create(ACCOUNT_MOCK)
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
            // 종료처리
            .then(done)
            .catch(done);
    });

    it('유저 업데이트 시도', function (done: DoneFn) {
        debug(`유저 업데이트 시도`);
        factory.updateOne(USER_TRY_UPDATE)
            // 생성 성공 결과 (목표)
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.nickname).toBe(ACCOUNT_MOCK.nickname);
                return factory.findByEmail(ACCOUNT_MOCK.email);
            })
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.nickname).toBe(USER_TRY_UPDATE.nickname);
                return Promise.resolve();
            })
            // 생성 및 검색 실패 (오류)
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            // 종료처리
            .then(done)
            .catch(done);
    });

    it('유저 삭제 시도', function (done: DoneFn) {
        debug(`유저 삭제 시도`);
        factory.deleteOne(USER_TRY_UPDATE.email)
            // 삭제 성공 결과 (목표)
            .then(r => {
                debug(`유저 삭제 시도 성공`);
                debug(r);
                expect(r).not.toBeNull();
                return Promise.resolve();
            })
            // 삭제 실패 (오류)
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            .then(() => {
                return AccountFactory.deleteOne(USER_TRY_UPDATE);
            })
            // 종료처리
            .then(done)
            .catch(done);
    });

    it('삭제된 유저에 대한 업데이트 시도', function (done: DoneFn) {
        debug(`삭제된 유저에 대한 업데이트 시도`);
        factory.updateOne(USER_TRY_UPDATE)
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
            // 종료처리
            .then(done)
            .catch(done);
    });

    it('이미 삭제된 유저 삭제 시도', function (done: DoneFn) {
        debug(`이미 삭제된 유저 삭제 시도`);
        factory.deleteOne(USER_TRY_UPDATE.email)
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
            // 종료처리
            .then(done)
            .catch(done);
    });

});