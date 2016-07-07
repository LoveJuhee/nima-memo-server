'use strict';
import {Promise} from 'es6-promise';

import {
  LOGGING_PROVIDER_UTIL_REQUEST,
} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_PROVIDER_UTIL_REQUEST);

const fs = require('fs');
const urlencode = require('urlencode');
const queryString = require('query-string');
const nodeUtil = require('util');

/**
 * 유틸리티 라이브러리 클래스
 * @class
 */
class RequestUtil {
  /**
   * Promise then 사용을 위한 단순 출력 객체
   * @param {Object} item 출력할 객체
   * @return {Promise} Promise 객체
   */
  print(item: any): Promise<Object> {
    return new Promise((resolve: any, reject: any) => {
      if (!item) {
        reject(new Error('item is null or undefined'));
      }
      console.log(item);
      resolve(item);
    });
  }

  /**
   * 동기식으로 파일을 읽어서 JSON으로 반환
   * @param {string} file 파일 경로
   * @return {array} JSON 배열
   */
  toJsonSync(file: string): Object {
    try {
      let reads = fs.readFileSync(file, 'utf8');
      return JSON.parse(reads);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * request params 객체를 인코딩하고 json을 object로 변환
   * @param {string} params request 요청 내용
   * @return {Object} 변환된 객체
   */
  fromRequestParams(params: string): Promise<Object> {
    let toEncodeObject = this.toEncodeObject;
    let toJsonObject = this.toJsonObject;
    return toEncodeObject(params)
      .then(toJsonObject)
      .catch(Promise.reject);
  }

  /**
   * request params 객체를 인코딩하고 json을 object로 변환
   * @param {string} params request 요청 내용
   * @return {Object} 변환된 객체
   */
  toJsonObject(params: Object): Promise<Object> {
    return new Promise((resolve: any, reject: any) => {
      if (!params) {
        resolve({});
      }
      try {
        let result = {};
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            result[key] = queryString.parse(params[key]);
          }
        }
        debug(`toJsonObject after ${nodeUtil.inspect(result)}`);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * request 발생 시 파라메터를 한글대응하기 위해 인코딩하고 반환
   * @param {Object} params request 파라메터
   * @return {Object} encode 처리한 오브젝트
   */
  toEncodeObject(params: Object): Promise<Object> {
    return new Promise((resolve: any, reject: any) => {
      if (!params) {
        resolve({});
      }
      try {
        let result = {};
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            result[key] = urlencode.decode(params[key]);
          }
        }
        debug(`toEncodeObject after ${nodeUtil.inspect(result)}`);
        resolve(result);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  /**
   * 한글에 대한 문자를 디코딩하고 반환
   * @param {Object} params 디코딩할 객체
   * @return {Object} decode 처리한 오브젝트
   */
  toDecodeObject(params: Object): Promise<Object> {
    return new Promise((resolve: any, reject: any) => {
      if (!params) {
        resolve({});
      }
      try {
        let result = {};
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            result[key] = urlencode(params[key]);
          }
        }
        debug(`toDecodeObject ${nodeUtil.inspect(result)}`);
        resolve(result);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }
}

const requestUtil = new RequestUtil();
export default requestUtil;
