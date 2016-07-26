'use strict';

import {Environment} from './params';

let test: Environment = new Environment();

test.mongo.uri = 'mongodb://127.0.0.1/nima-kitv-server-test';

test.sequelize.uri = 'sqlite://';
test.sequelize.options.logging = false;
test.sequelize.options.storage = 'test.sqlite';
test.sequelize.options.define.timestamps = false;

test.secrets.expiresIn = '1h';

test.seedDB = true;

module.exports = test;
