'use strict';
import {preset} from '../debug/spec-preset';
import {MongoManager} from './mongo-manager';

import mongoUtil from '../util/mongo-util';
import requestUtil from '../util/request-util';
import otherUtil from '../util/other-util';

import {LOGGING_TDD_MONGODB} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_TDD_MONGODB);

let manager: MongoManager;

describe('MongoManager Test', function () {
    beforeEach(function () {
        manager = new MongoManager(preset.app, false);
    });

    afterEach(function (done: DoneFn) {
        // DB의 경우 다른 테스트에서 활용하는 경우가 많아서 대기를 걸어줘야 오류가 발생하지 않는다.
        setTimeout(() => { done(); }, 3000);
    });

    it('connect & disconnect test', function (done: DoneFn) {
        function isConnected() {
            console.log(`1. after connect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(manager.readyState)}`);
            expect(manager.isConnected).toBeTruthy();

            console.log(`try disconnect`);
            manager.disconnect();
            setTimeout(isDisconnected, 2000);
        }
        function isDisconnected() {
            console.log(`1. after disconnect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(manager.readyState)}`);
            expect(manager.isConnected).not.toBeTruthy();
            done();
        }
        console.log(`try connect`);
        manager.connect();
        setTimeout(isConnected, 1000);
    });

    it('connect & disconnect promise test', function (done: DoneFn) {
        console.log(`try connect`);
        manager.connect()
            .then(() => {
                let state: number = manager.readyState;
                console.log(`2. after connect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(state)}`);
                expect(manager.isConnected).toBeTruthy();
                console.log(`try disconnect`);
                return manager.disconnect();
            }).then(() => {
                let state: number = manager.readyState;
                console.log(`2. after disconnect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(state)}`);
                expect(manager.isConnected).not.toBeTruthy();
            }).catch(otherUtil.print)
            .then(done);
    });
});
