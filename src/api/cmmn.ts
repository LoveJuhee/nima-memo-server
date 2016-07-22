import * as _ from 'lodash';
import {Request, Response, NextFunction} from 'express';

import config from '../config/environment';

/**
 * 계정 권한이 있는지 확인
 * 
 * @export
 * @param {string} roleRequired
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 */
export function hasRole(roleRequired: string): (req: Request, res: Response, next: NextFunction) => void {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return function (req: Request, res: Response, next: NextFunction): void {
        if (!req.user) {
            return res.status(401).end();
        }

        if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    }
}

/* --------------------------------------
 * common controller
 * ----------------------------------- */
/**
 * 결과값 응답
 * 
 * @export
 * @param {Response} res
 * @param {number} [statusCode=200]
 * @returns {(entity: any) => any}
 */
export function respondWithResult(res: Response, statusCode: number = 200): (entity: any) => any {
    return function (entity: any) {
        if (entity) {
            res.status(statusCode)
                .json(entity);
        }
        return entity;
    };
}

/**
 * 카운트 반환
 * 
 * @export
 * @param {Response} res
 * @param {number} [statusCode=200]
 * @returns {(entity: any) => any}
 */
export function respondWithCount(res: Response, statusCode: number = 200): (entity: any) => any {
    return function (entity: any) {
        if (entity) {
            res.status(statusCode)
                .json({
                    count: entity
                });
        }
        return entity;
    };
}

/**
 * 검색 실패
 * 
 * @export
 * @param {Response} res
 * @returns {(entity: any) => any}
 */
export function handleEntityNotFound(res: Response): (entity: any) => any {
    return function (entity: any) {
        if (!entity) {
            res.status(404)
                .end();
            return null;
        }
        return entity;
    };
}

/**
 * DB 처리 실패
 * 
 * @export
 * @param {Response} res
 * @param {number} [statusCode=500]
 * @returns {(err: any) => any}
 */
export function handleError(res: Response, statusCode: number = 500): (err: any) => any {
    return function (err: any) {
        res.status(statusCode)
            .send(err);
    };
}
