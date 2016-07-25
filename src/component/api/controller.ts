import * as _ from 'lodash';
import {Request, Response, NextFunction} from 'express';

import config from '../../config/environment';

import {DEBUG_CONTROLLER_COMMON} from '../../config/logger';
import {Debugger} from '../debugger';

/**
 * ApiController 공통부
 * 
 * @export
 * @class ApiController
 * @extends {Debugger}
 */
export class ApiController extends Debugger {
    constructor(debugKey: string = DEBUG_CONTROLLER_COMMON) {
        super(debugKey);
    }

    /**
     * 계정 권한이 있는지 확인
     * 
     * @param {string} roleRequired
     * @returns {(req: Request, res: Response, next: NextFunction) => void}
     */
    hasRole(roleRequired: string): (req: Request, res: Response, next: NextFunction) => void {
        if (!roleRequired) {
            throw new Error('Required role needs to be set');
        }

        return function (req: Request, res: Response, next: NextFunction): void {
            if (!req.user) {
                return res
                    .status(401)
                    .end();
            }

            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            } else {
                res
                    .status(403)
                    .send('Forbidden');
            }
        }
    }

    /**
     * 결과값 응답
     * 
     * @param {Response} res
     * @param {number} [failedCode=200] 결과 값이 없을 때 반환하는 스테이터스 코드
     * @param {number} [succeedCode=200] 결과 값이 있을 때 반환하는 스테이터스 코드
     * @returns {(entity?: any) => any}
     */
    respondWithResult(res: Response, failedCode: number = 200, succeedCode: number = 200): (entity?: any) => any {
        return function (entity: any) {
            if (!entity) {
                res
                    .status(failedCode)
                    .end();
            } else {
                res
                    .status(succeedCode)
                    .json(entity)
                    .end();
            }
            return entity;
        };
    }

    /**
     * 카운트 반환
     * 
     * @param {Response} res
     * @param {number} [failedCode=200] 결과 값이 0 또는 -n 일 때 반환하는 스테이터스 코드
     * @param {number} [succeedCode=200] 결과 값이 1 이상일 때 반환하는 스테이터스 코드
     * @returns {(entity?: number) => number}
     */
    respondWithCount(res: Response, failedCode: number = 200, succeedCode: number = 200): (entity?: number) => number {
        return function (entity: number) {
            if (!entity || entity < 0) {
                res
                    .status(succeedCode)
                    .json({
                        count: 0
                    })
                    .end();
            } else {
                res
                    .status(succeedCode)
                    .json({
                        count: entity
                    })
                    .end();
            }
            return entity;
        };
    }

    /**
     * 검색 실패
     * 
     * @param {Response} res
     * @returns {(entity?: any) => any}
     */
    handleEntityNotFound(res: Response): (entity?: any) => any {
        return function (entity: any) {
            if (entity) {
                res
                    .status(404)
                    .json(entity)
                    .end();
            } else {
                res
                    .status(404)
                    .end();
            }
            return entity;
        };
    }

    /**
     * 오류 발생에 따른 실패
     * 
     * @param {Response} res
     * @param {number} [statusCode=500]
     * @returns {(err?: any) => any}
     */
    handleError(res: Response, statusCode: number = 500): (err?: any) => any {
        return function (err: any) {
            if (err) {
                res
                    .status(statusCode)
                    .json(err)
                    .end();
            } else {
                res
                    .status(statusCode)
                    .end();
            }
        };
    }

    /**
     * 값 오류
     * 
     * @param {Response} res
     * @param {number} [statusCode=422]
     * @returns {(err?: any) => any}
     */
    validationError(res: Response, statusCode: number = 422): (err?: any) => any {
        return function (err: any) {
            if (err) {
                res
                    .status(statusCode)
                    .json(err)
                    .end();
            } else {
                res
                    .status(statusCode)
                    .end();
            }
        };
    }

    toString() {
        return 'ApiController class';
    }
}

/**
 * 클래스를 사용하지 않고 처리를 하는 팩토리
 */
const factory = new ApiController();
export default factory;