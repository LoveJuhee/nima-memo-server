'use strict';

import express = require('express');
import cors = require('cors');

/** 라우트 처리를 위한 객체 */
import * as route from '../config/route';
import {ServerIndex} from '../api/server/index';
import {MemoIndex} from '../api/memo/index';
import {UserIndex} from '../api/user/index';
import {AuthRoute} from '../auth';
import * as auth from '../auth/auth.service';

/** 전처리를 위한 객체 */
import * as bodyParser from 'body-parser';
import passport = require('passport');
import session = require('express-session');
import flash = require('connect-flash');
import logger = require('morgan');
import cookieParser = require('cookie-parser');

/**
 * express 구동 전 사전 작업 클래스
 * 
 * @export
 * @class ExpressPreset
 */
export class ExpressPreset {

  /**
   * Creates an instance of ExpressPreset.
   * 
   * @param {express.Application} app
   */
  constructor(private app: express.Application) {
    if (!app) {
      throw (new Error('app is null or undefined.'));
    }
    try {
      this.beforeSetting();
      this.routeSetting();
      this.afterSetting();
    } catch (error) {
      throw error;
    }
  }

  /**
   * ROUTE 전처리 작업
   * 
   * @private
   */
  private beforeSetting(): void {
    // // TODO: morgan 관련 내용 확인하고 적용한다.
    // this.app.use(logger('dev'));

    this.app.use(this.print);
    this.app.use(this.allowCrossDomain);

    // 복잡한 리퀘스트에 대한 이슈 (options 정보를 주고 받는 부분)
    this.app.use(cors());

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.beforePassport();
  }

  print(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(req.headers);
    next();
  }

  //CORS middleware
  allowCrossDomain(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }

  /**
   * 세션 및 PASSPORT 관련 작업 
   * 
   * @private
   */
  private beforePassport(): void {
    // passport setup
    this.app.use(session({
      secret: 'hyounwoo.ko',
      saveUninitialized: true,
      resave: true
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session()); // persistent login sessions
    this.app.use(flash()); // use connect-flash for flash messages stored in session
  }

  /**
   * rest route 설정 
   * 
   * @private
   */
  private routeSetting(): void {
    // TODO: 필요한 이유를 확인하고 점검하여 처리한다.
    // // write auth info
    // this.app.use('/', auth.writeAuthInfo);

    this.app.use(route.ROUTE_URI_SERVERS, new ServerIndex().routes);
    this.app.use(route.ROUTE_URI_MEMOS, new MemoIndex().routes);
    this.app.use(route.ROUTE_URI_USERS, new UserIndex().routes);
    this.app.use(route.ROUTE_URI_AUTH, new AuthRoute().routes);
  }

  /**
   * route 설정 이후의 작업
   * 
   * @private
   */
  private afterSetting(): void {
    /* Not Foud */
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      /**
       *  Error이라는 정의가 있지만 Error에는 status라는 정의가 없어서 any 설정
       *  (아마 typescript로 개발하다보면 any를 많이 쓰게된다)
       */
      const err: any = new Error('not_found');
      err.status = 404;
      next(err);
    });

    /* 에러 처리 */
    this.app.use((err: any, req: express.Request, res: express.Response) => {
      err.status = err.status || 500;
      console.error(`error on requst ${req.method} | ${req.url} | ${err.status}`);
      console.error(err.stack || `${err.message}`);

      err.message = err.status === 500 ? 'Something bad happened.' : err.message;
      res.status(err.status).send(err.message);
    });
  }

  /**
   * 객체 정보 출력
   * 
   * @returns
   */
  toString() {
    return 'ExpressPreset class';
  }
}
