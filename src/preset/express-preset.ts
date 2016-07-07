'use strict';

import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as route from '../config/route';
import ServerIndex from '../api/server/server-index';

/**
 * 컨트롤러 연결 클래스
 * @class
 */
class Linker {
  /**
   * 
   * 
   * @param {express.Application} app
   * @param {string} uri
   * @param {*} controller
   */
  link(app: express.Application, uri: string, controller: any) {
    app.get(uri, controller.index);
    app.get(uri + ':id', controller.show);
    app.post(uri, controller.create);
    app.put(uri + ':id', controller.update);
    app.patch(uri + ':id', controller.update);
    app.delete(uri + ':id', controller.destroy);
  }

  /**
   * 객체 정보 출력
   * 
   * @returns
   */
  toString() {
    return 'Linker class';
  }
}

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
      this.before();
      this.route();
      this.after();
    } catch (error) {
      throw error;
    }
  }

  private before(): void {
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
  }

  /**
   * rest route 설정 
   * 
   * @private
   */
  private route(): void {
    new ServerIndex(this.app, route.SERVER_API_URI);
  }

  private after(): void {
    /* Not Foud */
    this.app.use((req: express.Request, res: express.Response, next: Function) => {
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
