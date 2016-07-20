'use strict';

import {Environment} from './params';

let production: Environment = new Environment();

/**
 * MongoDB 설정
 */
production.mongo.uri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
  'mongodb://localhost/awesomeauction';

/**
 * Sequelize 설정
 */
production.sequelize.uri = process.env.SEQUELIZE_URI ||
  'sqlite://';
production.sequelize.options.logging = false;
production.sequelize.options.storage = 'dist.sqlite';
production.sequelize.options.define.timestamps = false;

/**
 * 오픈 IP
 */
production.ip = process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined;

/**
 * 토큰 유효시간
 */
production.secrets.expiresIn = '1h';

/**
 * 오픈 PORT
 */
production.port = process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  8080;

export default production;
