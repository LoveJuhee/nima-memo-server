'use strict';
import {preset} from '../debug/spec-preset';
import {MongoManager} from './mongo-manager';

let manager: MongoManager;

describe('MongoManager Test', function () {
    beforeEach(function () {
        manager = new MongoManager(preset.app, false);
    });

    it('connect test', function () {
        manager.connect();
    });

    it('disconnect test', function () {
        manager.disconnect();
    });
});
