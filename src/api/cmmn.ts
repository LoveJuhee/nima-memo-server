import * as _ from 'lodash';
import {Request, Response, NextFunction} from 'express';

import config from '../config/environment';

export function hasRole(roleRequired: string): Function {
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
export function respondWithResult(res: Response, statusCode = 200) {
    return function (entity: any) {
        if (entity) {
            res.status(statusCode)
                .json(entity);
        }
        return entity;
    };
}

export function respondWithCount(res: Response, statusCode = 200) {
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

export function handleEntityNotFound(res: Response) {
    return function (entity: any) {
        if (!entity) {
            res.status(404)
                .end();
            return null;
        }
        return entity;
    };
}

export function handleError(res: Response, statusCode = 500) {
    return function (err: any) {
        res.status(statusCode)
            .send(err);
    };
}
