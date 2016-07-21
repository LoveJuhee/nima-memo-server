import * as passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import {UserBusiness} from '../../api/user/user.business';
import {IUserModel} from '../../api/user/user.model';
import {Environment} from '../../config/environment/params';

function localAuthenticate(factory: UserBusiness,
    email: string = '', password: string = '',
    done: (err: any, res?: boolean | IUserModel, opt?: any) => void): void {

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

export function setup(factory: UserBusiness, config: Environment) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, function (email: string, password: string, done): void {
        return localAuthenticate(factory, email, password, done);
    }));
}
