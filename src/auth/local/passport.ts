import * as passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import {UserBusiness} from '../../api/user/user.business';
import {IUserModel} from '../../api/user/user.model';
import {Environment} from '../../config/environment/params';

import {DEBUG_AUTH_LOCAL} from '../../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_AUTH_LOCAL);

export class LocalPassport {
    constructor(private factory: UserBusiness, private config: Environment) {
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        }, (email, password, done) => {
            return this.localAuthenticate(factory, email, password, done);
        }));
    }

    /**
     * 기본 로그인 처리 
     * 
     * @param {UserBusiness} factory
     * @param {string} [email='']
     * @param {string} [password='']
     * @param {((err: any, res?: boolean | IUserModel, info?: any) => void)} done
     */
    localAuthenticate(factory: UserBusiness,
        email: string = '', password: string = '',
        done: (err: any, res?: boolean | IUserModel, info?: any) => void): void {

        debug(`localAuthenticate`);
        debug(`email: ${email}, password: ${password}`);

        factory.findByEmail(email.toLowerCase())
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'This email is not registered.' });
                }
                user.authenticate(password, function (authError: any, authenticated: boolean): void {
                    if (authError) {
                        return done(authError);
                    }
                    if (!authenticated) {
                        return done(null, false, { message: 'This password is not correct.' });
                    } else {
                        return done(null, user);
                    }
                });
            })
            .catch(err => done(err));
    }

    toString() {
        return 'LocalPassport class';
    }
}

// function localAuthenticate(factory: UserBusiness,
//     email: string = '', password: string = '',
//     done: (err: any, res?: boolean | IUserModel, info?: any) => void): void {

//     factory.findByEmail(email.toLowerCase())
//         .then(user => {
//             if (!user) {
//                 return done(null, false, { message: 'This email is not registered.' });
//             }
//             user.authenticate(password, function (authError: any, authenticated: boolean): void {
//                 if (authError) {
//                     return done(authError);
//                 }
//                 if (!authenticated) {
//                     return done(null, false, { message: 'This password is not correct.' });
//                 } else {
//                     return done(null, user);
//                 }
//             });
//         })
//         .catch(err => done(err));
// }

// export function setup(factory: UserBusiness, config: Environment) {
//     passport.use(new LocalStrategy({
//         usernameField: 'email',
//         passwordField: 'password' // this is the virtual field on the model
//     }, function (email: string, password: string, done: (err: any, res?: boolean | IUserModel, info?: any) => void): void {
//         return localAuthenticate(factory, email, password, done);
//     }));
// }
