'use strict';
import {preset} from '../../debug/spec-preset';

import {LocalPassport} from './passport';
import factory from '../../api/user/user.business';

import {DEBUG_TDD_AUTH_LOCAL} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_TDD_AUTH_LOCAL);

let passport = new LocalPassport(factory, null);
const USER_ACCOUNT = {
    email: 'local-passport@test.com',
    password: 'local-password',
    nick: 'local-nickname',
};
const PASSWORD_NOT_MATCH = {
    email: USER_ACCOUNT.email,
    password: 'password-diff',
    nick: USER_ACCOUNT.nick,
};

describe('LocalPassport 테스트', function () {
    beforeEach(function (done: DoneFn) {
        preset.db.connect()
            .then(done)
            .catch(e => {
                debug(e);
                done();
            });
    });

    afterEach(function (done: DoneFn) {
        // DB의 경우 다른 테스트에서 활용하는 경우가 많아서 대기를 걸어줘야 오류가 발생하지 않는다.
        setTimeout(() => {
            preset.db.disconnect()
                .then(done)
                .catch(e => {
                    debug(e);
                    done();
                });
        }, 500);
    });

    it('없는 계정으로 안힌 인증 실패 테스트', function (done: DoneFn) {
        debug('없는 계정으로 안힌 인증 실패 테스트');
        const EMAIL = USER_ACCOUNT.email;
        const PASSWORD = USER_ACCOUNT.password;
        passport.localAuthenticate(factory, EMAIL, PASSWORD, (e, r, i) => {
            if (e) {
                debug('passport.localAuthenticate() : error');
                debug(e);
            }
            expect(e).toBeNull();
            expect(r).toBeFalsy();
            expect(i).not.toBeNull();
            expect(i).not.toBeUndefined();
            expect(i.message).not.toBeNull();
            expect(i.message).not.toBeUndefined();
            done();
        });
    });

    it('테스트 데이터 생성', function (done: DoneFn) {
        debug('테스트 데이터 생성');
        factory.create(USER_ACCOUNT)
            .then(r => {
                done();
            })
            .catch(err => {
                debug(err);
                done();
            });
    });

    it('암호 미일치로 안힌 인증 실패 테스트', function (done: DoneFn) {
        debug('암호 미일치로 안힌 인증 실패 테스트');
        const EMAIL = PASSWORD_NOT_MATCH.email;
        const PASSWORD = PASSWORD_NOT_MATCH.password;
        passport.localAuthenticate(factory, EMAIL, PASSWORD, (e, r, i) => {
            if (e) {
                debug('passport.localAuthenticate() : error');
                debug(e);
            }
            expect(e).toBeNull();
            expect(r).toBeFalsy();
            expect(i).not.toBeNull();
            expect(i).not.toBeUndefined();
            expect(i.message).not.toBeNull();
            expect(i.message).not.toBeUndefined();
            done();
        });
    });

    it('인증 성공 테스트', function (done: DoneFn) {
        debug('인증 성공 테스트');
        const EMAIL = USER_ACCOUNT.email;
        const PASSWORD = USER_ACCOUNT.password;
        passport.localAuthenticate(factory, EMAIL, PASSWORD, (e, r, i) => {
            if (e) {
                debug('passport.localAuthenticate() : error');
                debug(e);
            }
            debug(r);
            expect(e).toBeNull();
            expect(r).not.toBeNull();
            expect(r).not.toBeFalsy();
            expect(i).toBeUndefined();
            done();
        });
    });

    it('테스트 데이터 삭제', function (done: DoneFn) {
        debug('테스트 데이터 삭제');
        factory.deleteOne(USER_ACCOUNT.email)
            .then(r => {
                done();
            })
            .catch(err => {
                debug(err);
                done();
            });
    });
});