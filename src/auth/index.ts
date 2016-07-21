'use strict';

import * as express from 'express';
import * as passport from 'passport';

import config from '../config/environment';
import User from '../api/user/user.business';

import {AuthLocalIndex} from './local';

// Passport Configuration
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);

var router = express.Router();

router.use('/local', new AuthLocalIndex(User, config).routes);
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

export default router;
