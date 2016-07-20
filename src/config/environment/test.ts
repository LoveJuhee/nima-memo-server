'use strict';

import {Environment} from './params';

let development: Environment = new Environment();

development.mongo.uri = 'mongodb://127.0.0.1/nima-kitv-server-test';

development.sequelize.uri = 'sqlite://';
development.sequelize.options.logging = false;
development.sequelize.options.storage = 'test.sqlite';
development.sequelize.options.define.timestamps = false;

development.secrets.expiresIn = '1h';

development.seedDB = true;

export default development;
