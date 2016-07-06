/// <reference path='../typings/index.d.ts' />
require('source-map-support').install();

import * as http from 'http';
import AppServer from './app-server';

/**
 * 컨트롤러 연결 클래스
 * @class
 */
class App {
  private server: AppServer;
  /**
   * Creates an instance of Routes.
   * 
   */
  constructor(run: boolean = true) {
    this.server = new AppServer();
    if (run) {
      this.start();
    }
  }

  /**
   * start
   */
  public start() {
    this.server.startup();
  }

  /**
   * stop
   */
  public stop() {
    this.server.shutdown();
  }

  /**
   * 객체 정보 출력
   * 
   * @returns
   */
  toString() {
    return 'App class';
  }
}

const app = new App();
export default app;
