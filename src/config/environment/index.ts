'use strict';

var path = require('path');

import {Environment} from './params';
import userRoles from './shared';

/**
 * 기본 환경 로드하기 (production, develop, test)
 */
let environment: Environment;
let nodeEnv = process.env.NODE_ENV || 'development';
console.log(`NODE_ENV : ${nodeEnv}`);
environment = require('./' + nodeEnv);
if (!environment) {
  // 실패 시 development 로드한다.
  nodeEnv = 'development';
  environment = require('./' + nodeEnv);
}

/**
 * 기본 설정 값
 */
environment.env = nodeEnv;

/**
 * ROOT 경로 설정
 */
environment.root = path.normalize(__dirname + '/../../..');

/**
 * 오픈 IP 설정 
 */
environment.ip = environment.ip || process.env.IP || '0.0.0.0';

console.log(environment);
console.log(environment.secrets);

/**
 * 보안 설정
 */
environment.secrets.session = 'nima-kitv-server';

/**
 * MongoDB 설정
 */
environment.mongo.options = { db: { safe: true } };

/**
 * 계정 권한
 */
environment.userRoles = userRoles;

/**
 * Facebook
 */
environment.facebook.id = process.env.FACEBOOK_ID || 'id';
environment.facebook.secret = process.env.FACEBOOK_SECRET || 'secret';
environment.facebook.callbackUrl = (process.env.DOMAIN || '') + '/auth/facebook/callback';

/**
 * Twtter
 */
environment.twitter.id = process.env.TWITTER_ID || 'id';
environment.twitter.secret = process.env.TWITTER_SECRET || 'secret';
environment.twitter.callbackUrl = (process.env.DOMAIN || '') + '/auth/twitter/callback';

/**
 * Google
 */
environment.google.id = process.env.GOOGLE_ID || 'id';
environment.google.secret = process.env.GOOGLE_SECRET || 'secret';
environment.google.callbackUrl = (process.env.DOMAIN || '') + '/auth/google/callback';

export default environment;