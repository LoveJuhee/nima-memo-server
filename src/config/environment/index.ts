'use strict';

var path = require('path');

import {Environment} from './params';
import userRoles from './shared';

import {DEBUG_CONFIG_ENVIRONMENT} from '../logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_CONFIG_ENVIRONMENT);

/**
 * 기본 환경 로드하기 (production, develop, test)
 */
let environment: Environment;
let nodeEnv = process.env.NODE_ENV || 'development';
debug(`NODE_ENV 값 : ${nodeEnv}`);
try {
  environment = require('./' + nodeEnv);
} catch (error) {
  // 실패 시 development 로드한다.
  nodeEnv = 'development';
  environment = require('./' + nodeEnv);
}

debug('Environment 기본 설정 체크');
debug(environment);

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

debug('Environment 생성 결과');
debug(environment);

export default environment;