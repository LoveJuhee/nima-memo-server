/// <reference path='../typings/index.d.ts' />
require('source-map-support').install();

import AppServer from './app-server';

/**
 * 메인 App 클래스
 * 
 * @export
 * @class App
 */
export class App {
  private server: AppServer;

  /**
   * Creates an instance of App.
   * 
   * @param {boolean} [run=true] 생성과 동시에 웹서비스 구동 여부 설정
   */
  constructor(run: boolean = true) {
    this.server = new AppServer();
    if (run) {
      this.start();
    }
  }

  /**
   * 웹서비스 실행
   */
  public start() {
    this.server.startup();
  }

  /**
   * 웹서비스 중지
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
