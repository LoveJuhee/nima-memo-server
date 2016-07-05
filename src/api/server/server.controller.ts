'use strict';
require('source-map-support').install();

/* test-code */
import {
    IS_DEBUG_ROUTE_SERVER,
} from '../../config/debug.flag';
/* end-test-code */
import {
    LOGGING_API_SERVER,
} from '../../config/config';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_API_SERVER);

// import {
//   default as nimaUtil
// } from '../../providers/util';
const nodeUtil = require('util');

export const NIMA_ROUTE_URI = '/api/nimas';

/**
 * rest nima 에 대한 처리 클래스
 * @class
 */
export class NimaController {
    constructor() {
        debug(`NimaController create`);
    }

    /**
     * get 대응 로직
     * @param {request} req 리퀘스트 요청 정보 객체
     * @param {result} res 요청 처리 결과 반환 객체
     * @return {void} void
     */
    index(req, res) {
        let params = req.params;
        debug(`index ${nodeUtil.inspect(params)}`);
        res.send('index');
    }

    /**
     * get:id 대응 로직
     * @param {request} req 리퀘스트 요청 정보 객체
     * @param {result} res 요청 처리 결과 반환 객체
     * @return {void} void
     */
    show(req, res) {
        debug(`params: ${nodeUtil.inspect(req.params)}`);
        nimaUtil.fromRequestParams(req.params)
            .then(nimaUtil.print)
            .then(r => {
                res.send(`show ${nodeUtil.inspect(r)}`);
            });
    }

    /**
     * post 대응 로직
     * @param {request} req 리퀘스트 요청 정보 객체
     * @param {result} res 요청 처리 결과 반환 객체
     * @return {void} void
     */
    create(req, res) {
        let body = req.body;
        debug(`create ${nodeUtil.inspect(body)}`);
        res.send(`create ${nodeUtil.inspect(body)}`);
    }

    /**
     * put, patch 대응 로직
     * @param {request} req 리퀘스트 요청 정보 객체
     * @param {result} res 요청 처리 결과 반환 객체
     * @return {void} void
     */
    update(req, res) {
        let params = nimaUtil.toEncodeObject(req.params);
        debug(`update ${nodeUtil.inspect(params)}`);
        res.send('update');
    }

    /**
     * delete 대응 로직
     * @param {request} req 리퀘스트 요청 정보 객체
     * @param {result} res 요청 처리 결과 반환 객체
     * @return {void} void
     */
    destroy(req, res) {
        let params = nimaUtil.toEncodeObject(req.params);
        debug(`destroy ${nodeUtil.inspect(params)}`);
        res.send('destroy');
    }

    toString() {
        return 'NimaController class';
    }
}
