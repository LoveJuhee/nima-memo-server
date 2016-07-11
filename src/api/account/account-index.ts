'use strict';

import {Application} from 'express';
import {AccountController} from './account-controller';
import {AccountBusiness} from '../../business/account/account-business';

export class AccountIndex {
    business: AccountBusiness;

    /**
     * Creates an instance of AccountIndex.
     * 
     * @param {string} uri 기본 경로
     */
    constructor(app: Application, uri: string = '') {
        if (!app) {
            throw (new Error('app is invalied.'));
        }
        this.business = new AccountBusiness();
        this.link(app, uri, new AccountController());
    }

    /**
     * RESTful 연결
     * 
     * @private
     * @param {string} uri 기본 경로
     * @param {AccountController} controller 처리 객체
     */
    private link(app: Application, uri: string, controller: AccountController): void {
        app.post(uri + '/signup', controller.signup);
        app.delete(uri + '/signout', controller.signout);
    }

    toString() {
        return 'AccountIndex class';
    }
}