'use strict';

import {Environment} from './params';

let development: Environment = new Environment();

development.mongo.uri = 'mongodb://127.0.0.1/nima-kitv-server-dev';

development.sequelize.uri = 'sqlite://';
development.sequelize.options.logging = false;
development.sequelize.options.storage = 'dist.sqlite';
development.sequelize.options.define.timestamps = false;

development.secrets.expiresIn = '1d';

development.seedDB = true;

module.exports = development;
