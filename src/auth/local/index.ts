'use strict';

import {Router, Request, Response, NextFunction} from 'express';
import * as passport from 'passport';

import {signToken} from '../auth.service';
import {IUserModel} from '../../api/user/user.model';

var router = Router();

router.post('/', function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', function (err: any, user: IUserModel, info: any) {
        var error = err || info;
        if (error) {
            return res.status(401).json(error);
        }
        if (!user) {
            return res.status(404).json({ message: 'Something went wrong, please try again.' });
        }

        var token = signToken(user._id, user.role + '');
        res.json({ token });
    })(req, res, next);
});

export default router;
