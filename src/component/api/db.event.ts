'use strict';

import {Schema, Document, Model} from 'mongoose';
import {EventEmitter} from 'events';

import {DEBUG_DB_EVENT_COMMON} from '../../config/logger';
import {Debugger} from '../debugger';

/**
 * Db Event 발생 클래스
 * 
 * @export
 * @abstract
 * @class ApiDbEvent
 * @extends {Debugger}
 * @template T
 */
export abstract class ApiDbEvent<T extends Document> extends Debugger {
    private _emitter = new EventEmitter();

    constructor(schema: Schema, debugKey: string = DEBUG_DB_EVENT_COMMON) {
        super(debugKey);

        if (!schema) {
            throw (new Error(`invalid schema`));
        }

        let events = this.getEvents();
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            schema.post(event.dbEvent, this.emitEvent(event.event));
        }
    }

    /**
     * 이벤트 객체 모음
     * dbEvent: DB 갱신 등으로 발생하는 이벤트
     * event: 전파되는 이벤트
     * 
     * @abstract
     * @returns {{ dbEvent: string, event: string }[]}
     */
    abstract getEvents(): { dbEvent: string, event: string }[];

    /**
     * 데이터 전송 전에 정리해야하는 로직 구현
     * 
     * @abstract
     * @param {T} item
     * @returns {T}
     */
    abstract preset(item: T): T;

    /**
     * 이벤트 발생 객체
     * 
     * @readonly
     * @type {EventEmitter}
     */
    get emitter(): EventEmitter {
        return this._emitter;
    }

    /**
     * 이벤트 발생
     * 
     * @param {string} event
     * @returns
     */
    emitEvent(event: string) {
        let preset = this.preset;
        let emitter = this.emitter;
        return function (doc: T): void {
            doc = preset(doc);
            emitter.emit(`${event} : ${doc._id}`, doc);
            emitter.emit(event, doc);
        };
    }

    toString() {
        return 'ApiDbEvent class';
    }
}