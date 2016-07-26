'use strict';
import {preset} from '../../debug/spec-preset';

import factory from './user.business';

import otherUtil from '../../component/util/other.util';

import {DEBUG_TDD_BUSINESS_USER} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_TDD_BUSINESS_USER);

const EMAIL_MOCK = {
    email: 'user.business.spec@nima.com',
};
const ACCOUNT_MOCK = {
    email: EMAIL_MOCK.email,
    password: 'nima1234',
    nick: 'user.business.spec.nick',
};
const USER_NICK_UPDATE = {
    email: ACCOUNT_MOCK.email,
    password: ACCOUNT_MOCK.password,
    nick: 'update-nick-ok?',
};
const USER_PASSWORD_UPDATE = {
    email: ACCOUNT_MOCK.email,
    password: 'update-password-ok?',
    nick: USER_NICK_UPDATE.nick,
};
const USER_NICK_DUPLICATE = {
    email: 'user.business.spec.duplicate.nick@nima.com',
    password: ACCOUNT_MOCK.password,
    nick: USER_PASSWORD_UPDATE.nick,
};
let latsUserId: string = '';

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
        }, 500);
    });

    it('유저 생성 시도', function (done: DoneFn) {
        debug(`유저 생성 시도`);
        factory.create(ACCOUNT_MOCK)
            // 생성 성공 (목표)
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.email).not.toBeNull();
                expect(r.email).toBe(ACCOUNT_MOCK.email);
                expect(r.nick).not.toBeNull();
                expect(r.nick).toBe(ACCOUNT_MOCK.nick);
                latsUserId = r._id;
                return Promise.resolve();
            })
            // 생성 실패 (오류)
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            // 종료처리
            .then(done);
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
            .then(done);
    });

    it('유저 닉네임 업데이트 시도', function (done: DoneFn) {
        debug(`유저 닉네임 업데이트 시도`);
        factory.updateById(latsUserId, USER_NICK_UPDATE)
            // 닉네임 업데이트 성공 결과 (목표)
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.nick).toBe(ACCOUNT_MOCK.nick);
                return factory.findByEmail(ACCOUNT_MOCK.email);
            })
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r.nick).toBe(USER_NICK_UPDATE.nick);
                return Promise.resolve();
            })
            // 닉네임 업데이트 및 검색 실패 (오류)
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            // 종료처리
            .then(done);
    });

    it('유저 암호 업데이트 시도', function (done: DoneFn) {
        debug(`유저 암호 업데이트 시도`);
        factory.updatePassword(USER_PASSWORD_UPDATE)
            // 암호 업데이트 성공 결과 (목표)
            .then(r => {
                debug(r);
                try {
                    expect(r).not.toBeNull();
                    expect(r).not.toBeUndefined();
                    expect(r.nick).toBe(USER_PASSWORD_UPDATE.nick);
                } catch (error) {
                    debug(error);
                }
                return factory.findByEmail(USER_PASSWORD_UPDATE.email);
            })
            .then(r => {
                debug(r);
                expect(r).not.toBeNull();
                expect(r).not.toBeUndefined();
                expect(r.nick).toBe(USER_PASSWORD_UPDATE.nick);
                return Promise.resolve();
            })
            // 암호 업데이트 및 검색 실패 (오류)
            .catch(err => {
                debug(err);
                expect(err).toBeNull();
                return Promise.resolve();
            })
            // 종료처리
            .then(done);
    });

    it('중복된 닉네임 유저 생성 시도', function (done: DoneFn) {
        debug(`중복된 닉네임 유저 생성 시도`);
        factory.create(USER_NICK_DUPLICATE)
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
            .then(done);
    });

    it('유저 삭제 시도', function (done: DoneFn) {
        debug(`유저 삭제 시도`);
        factory.deleteById(latsUserId)
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
            // 종료처리
            .then(done);
    });

    it('삭제된 유저에 대한 업데이트 시도', function (done: DoneFn) {
        debug(`삭제된 유저에 대한 업데이트 시도`);
        factory.updateById(latsUserId, USER_NICK_UPDATE)
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
            .then(done);
    });

    it('이미 삭제된 유저 삭제 시도', function (done: DoneFn) {
        debug(`이미 삭제된 유저 삭제 시도`);
        factory.deleteById(latsUserId)
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
            .then(done);
    });

});