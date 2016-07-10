/**
 * Created by borja on 27/03/16.
 */

import {Passport} from 'passport';
import {Strategy as LocalStrategy, IStrategyOptionsWithRequest} from 'passport-local';

import {IUserModel} from '../model/user/user-schema';
import UserFactory from '../model/user/user';
import UserBusiness from '../business/user/user-business';

import passportUtil from '../util/passport-util';

export function setupStrategies(passport: Passport): void {

    // ====================== //
    // passport session setup //
    // ====================== //
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user: any, done: any) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id: any, done: any) {
        UserFactory.findById(id, function (err: any, user: IUserModel) {
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
        new LocalStrategy(strategyParams, (req, email, password, done) => {
            // async
            process.nextTick(function () {
                if (!req.user) {
                    // first we try to find the user to see if already exists
                    UserFactory.findOne({ 'email': email }, function (err: any, user: IUserModel) {
                        if (err) {
                            return done(err);
                        }

                        // 검색결과가 있다면 등록된 email이라고 반환을 한다.
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {
                            // email, password를 제외한 데이터는 모두 body 객체에서 정보를 가져와서 생성한다.
                            let body = req.body;
                            let newUser: Object = {
                                name: body.name,
                                email: email,
                                password: passportUtil.generateHash(password),
                            };

                            // 계정정보를 이용하여 IUserModel을 생성한다.
                            UserFactory.create(newUser, (err: any, res: IUserModel) => {
                                // 생성된 IUserModel을 추가한다.
                                new UserBusiness().create(res)
                                    .then(() => { return done(null, newUser); })
                                    .catch(err => { return done(err); });
                            });
                        }
                    });
                } else {
                    // If the user is already logged in, we add the credential into profile
                    var user = req.user;

                    // set the credentials
                    user.email = email;
                    user.password = passportUtil.generateHash(password);

                    // 계정정보를 이용하여 IUserModel을 생성한다.
                    UserFactory.create(user, (err: any, res: IUserModel) => {
                        // 생성된 IUserModel을 추가한다.
                        new UserBusiness().create(res)
                            .then(() => { return done(null, user); })
                            .catch(err => { return done(err); });
                    });
                }
            });
        })
    );

    // =========== //
    // LOCAL LOGIN //
    // =========== //
    // We create another strategy for the login process
    passport.use('local-login',
        new LocalStrategy(strategyParams, (req, email, password, done) => {
            // first check if the user already exists
            UserFactory.findOne({ 'email': email }, function (err: any, user: IUserModel) {
                // If there are any error, return the error
                if (err) {
                    return done(err);
                }

                // if no user is found, return message
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // if the user exists, we check the password
                if (!passportUtil.validPassword(password, user.password + '')) {
                    return done(null, false, req.flash('loginMessage', 'Opps! Wrong password.'));
                }

                // if everything is ok, return the user
                return done(null, user);
            });
        })
    );

};