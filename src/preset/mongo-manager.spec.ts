'use strict';
import {preset} from '../debug/spec-preset';
import {MongoManager} from './mongo-manager';

import mongoUtil from '../component/util/mongo.util';
import requestUtil from '../component/util/request.util';
import otherUtil from '../component/util/other.util';

import {DEBUG_TDD_PRESET_MONGO_MANAGER} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG_TDD_PRESET_MONGO_MANAGER);

let manager: MongoManager;

describe('MongoManager Test', function () {
    beforeEach(function () {
        manager = new MongoManager(preset.app, false);
    });

    afterEach(function (done: DoneFn) {
        // DB의 경우 다른 테스트에서 활용하는 경우가 많아서 대기를 걸어줘야 오류가 발생하지 않는다.
        setTimeout(() => { done(); }, 1000);
    });

    it('connect & disconnect test', function (done: DoneFn) {
        function isConnected() {
            debug(`1. after connect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(manager.readyState)}`);
            expect(manager.isConnected).toBeTruthy();

            debug(`try disconnect`);
            manager.disconnect();
            setTimeout(isDisconnected, 100);
        }
        function isDisconnected() {
            debug(`1. after disconnect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(manager.readyState)}`);
            expect(manager.isConnected).not.toBeTruthy();
            done();
        }
        debug(`try connect`);
        manager.connect();
        setTimeout(isConnected, 100);
    });

    it('connect & disconnect promise test', function (done: DoneFn) {
        debug(`try connect`);
        manager.connect()
            .then(() => {
                let state: number = manager.readyState;
                debug(`2. after connect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(state)}`);
                expect(manager.isConnected).toBeTruthy();
                debug(`try disconnect`);
                return manager.disconnect();
            }).then(() => {
                let state: number = manager.readyState;
                debug(`2. after disconnect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(state)}`);
                expect(manager.isConnected).not.toBeTruthy();
            }).catch(otherUtil.print)
            .then(done);
    });
});
