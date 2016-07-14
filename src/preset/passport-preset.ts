/**
 * Created by borja on 27/03/16.
 */

import {Passport} from 'passport';
import {Strategy as LocalStrategy, IStrategyOptionsWithRequest} from 'passport-local';

import {IAccountModel} from '../model/account/account-schema';
import factory from '../business/account/account-business';

import passportUtil from '../util/passport-util';

import {DEBUG_PRESET_PASSPORT} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_PRESET_PASSPORT);

export function setupStrategies(passport: Passport): void {

    // ====================== //
    // passport session setup //
    // ====================== //
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user: IAccountModel, done: (err: any, user: any) => void) {
        debug(`passport.serializeUser`);
        debug(user);
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id: any, done: (err: any, user: any) => void) {
        debug(`passport.deserializeUser`);
        factory.findById(id, (err, user) => {
            debug(user);
            done(err, user);
        });
    });

    let strategyParams: IStrategyOptionsWithRequest = {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
    };

    // ============ //
    // LOCAL SIGNUP //
    // ============ //
    passport.use('local-signup',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, email, password, done) => {
            // async
            process.nextTick(function () {
                let email: string;
                let password: string;

                // req.user 가 있으면 req.user 값으로 계정을 만든다. 없으면 body에서 추출한다. 
                if (!req.user) {
                    email = req.body.email;
                    password = req.body.password;
                } else {
                    email = req.user.email;
                    password = req.user.password;
                }

                debug(`passport.local-signup`);
                debug(`${email}, ${password}`);
                try {
                    // email 계정이 있는지 확인하고 없으면 추가하는 흐름으로 구현한다.
                    factory.findByEmail(email, (err, account) => {
                        if (err) {
                            debug(`passport.local-signup findByEmail err`);
                            debug(err);
                            return done(err);
                        }

                        // 검색결과가 있으면 이미 가입한 계정으로 안내한다.
                        if (account) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        }

                        debug(`try passport.local-signup create`);
                        factory.create({ email, password })
                            // 생성 성공에 따른 리턴 처리
                            .then(res => {
                                debug(`passport.local-signup create succeed`);
                                debug(res);
                                return done(null, res);
                            })
                            // 생성 실패에 따른 리턴처리
                            .catch(err => {
                                debug(`passport.local-signup create failed`);
                                debug(err);
                                return done(err);
                            });
                    });
                } catch (error) {
                    console.log(error);
                }
            });
        })
    );

    // =========== //
    // LOCAL LOGIN //
    // =========== //
    // We create another strategy for the login process
    passport.use('local-login',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, email, password, done) => {
            debug(`passport.local-login`);
            debug(`${email}, ${password}`);

            // first check if the user already exists
            factory.findOne({ email, password }, (err, user) => {
                // If there are any error, return the error
                if (err) {
                    debug(`passport.local-login errored`);
                    debug(err);
                    return done(err);
                }

                // 반환이 null 이면 email, password 가 다르다고 판단한다.
                if (!user) {
                    console.log(`passport.local-login findOne failed`);
                    debug(`passport.local-login findOne failed`);
                    return done(null, false, req.flash('loginMessage', 'login failed.'));
                }

                // if everything is ok, return the user
                return done(null, user);
            });
        })
    );

};
