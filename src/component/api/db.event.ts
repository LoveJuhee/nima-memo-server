'use strict';

import {Schema, Document, Model} from 'mongoose';
import {EventEmitter} from 'events';

import {DEBUG_DB_EVENT_COMMON} from '../../config/logger';
import {Debugger} from '../debugger';

export class DbEventKeyValue {
    constructor(dbEvent: string, event: string) {
        this.dbEvent = dbEvent;
        this.event = event;
    }

    private _dbEvent: string;
    set dbEvent(dbEvent: string) {
        this._dbEvent = dbEvent;
    }
    get dbEvent(): string {
        return this._dbEvent;
    }

    private _event: string;
    set event(event: string) {
        this._event = event;
    }
    get event(): string {
        return this._event;
    }

    toString() {
        return 'DbEventKeyValue class';
    }
}

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

        // DB post 이벤트 연결 구현 
        let events = this.getEvents();
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            this.debugger(event);
            schema.post(event.dbEvent, this.emitEvent(event));
        }
    }

    /**
     * 이벤트 객체 모음
     * dbEvent: DB 갱신 등으로 발생하는 이벤트
     * event: 전파되는 이벤트
     * 
     * @abstract
     * @returns {DbEventKeyValue[]}
     */
    abstract getEvents(): DbEventKeyValue[];

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
    emitEvent(evt: DbEventKeyValue) {
        let d = this.debugger;
        let preset = this.preset;
        let emitter = this.emitter;
        return function (doc: T): void {
            d(evt);
            d(doc);
            doc = preset(doc);
            d(`preset(doc)`);
            d(doc);
            emitter.emit(`${evt.event} : ${doc._id}`, doc);
            emitter.emit(evt.event, doc);
        };
    }

    toString() {
        return 'ApiDbEvent class';
    }
}