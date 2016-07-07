'use strict';
import {preset} from '../debug/spec-preset';
import {MongoManager} from './mongo-manager';
import mongoUtil from '../util/mongo-util';

import {
    LOGGING_TDD_MONGODB
} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(LOGGING_TDD_MONGODB);

let manager: MongoManager;

describe('MongoManager Test', function () {
    beforeEach(function () {
        manager = new MongoManager(preset.app, false);
    });

    it('connect & disconnect test', function (done) {
        function isConnected() {
            console.log(`after connect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(manager.readyState)}`);
            expect(manager.isConnected).toBeTruthy();

            console.log(`try disconnect`);
            manager.disconnect();
            setTimeout(isDisconnected, 2000);
        }
        function isDisconnected() {
            console.log(`after disconnect(), manager.readyState: ${manager.readyState}, ${mongoUtil.toStringForReadyState(manager.readyState)}`);
            expect(manager.isConnected).not.toBeTruthy();
            done();
        }
        console.log(`try connect`);
        manager.connect();
        setTimeout(isConnected, 1000);
    });
});
