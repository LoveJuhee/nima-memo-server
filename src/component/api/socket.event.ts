'use strict';

import {Document} from 'mongoose';
import {EventEmitter} from 'events';

import {ApiDbEvent, DbEventKeyValue} from './db.event';
import {SocketClient} from '../socket.io/socket.client';

import {DEBUG_SOCKET_CLIENT} from '../../config/logger';
import {Debugger} from '../debugger';

export class ApiSocketEvent<T extends Document> extends Debugger {
    private _key: string;
    private _event: ApiDbEvent<T>;

    /**
     * Creates an instance of ApiSocketEvent.
     * 
     * @param {string} key 소켓 클라이언트가 받을 이벤트 키
     * @param {ApiDbEvent<T>} event ApiDbEvent 상속 클래스 객체
     * @param {string} [debugKey=DEBUG_SOCKET_CLIENT]
     */
    constructor(key: string, event: ApiDbEvent<T>, debugKey: string = DEBUG_SOCKET_CLIENT) {
        super(debugKey);
        if (!key) {
            throw 'key is empty';
        }
        if (!event) {
            throw 'event is empty';
        }
        this._key = key;
        this._event = event;
    }

    /**
     * 소켓 클라이언트에 DbEvent 연결
     * 
     * @param {SocketClient} socket
     */
    register(client: SocketClient): void {
        if (!client) {
            throw 'socket is empty';
        }

        const KEY = this._key;
        const EVENT_LIST = this._event.getEvents() || [];
        let emitter = this._event.emitter;
        for (let i = 0, eventsLength = EVENT_LIST.length; i < eventsLength; i++) {
            let event = EVENT_LIST[i];
            // 리스너 생성 및 이벤트 연결
            let listener = this.createListener(`${KEY}:${event.event}`, client);
            emitter.on(event.event, listener);
            // 소켓 종료 시 리스너 해제
            client.socket.on('disconnect', this.removeListener(emitter, event, listener, client));
        }
    }

    /**
     * ApiDbEvent 이벤트 리스너 생성 (DB 이벤트 발생 시 소켓으로 전송) 
     * 
     * @param {string} event
     * @param {SocketClient} client
     * @returns {Function}
     */
    createListener(event: string, client: SocketClient): Function {
        let d = this.debugger;
        let socket = client.socket;
        const ADDRESS = client.address;
        d(`${ADDRESS} create event listener '${event}'`);
        return (doc: T) => {
            d(`${ADDRESS} receive event '${event}'`);
            socket.emit(event, doc);
        };
    }

    /**
     * 소켓 종료 시 이벤트 리스너 제거
     * 
     * @param {EventEmitter} emitter
     * @param {DbEventKeyValue} event
     * @param {*} listener
     * @param {SocketClient} client
     * @returns {Function}
     */
    removeListener(emitter: EventEmitter, event: DbEventKeyValue, listener: any, client: SocketClient): Function {
        let d = this.debugger;
        const ADDRESS = client.address;
        return () => {
            d(`${ADDRESS} remove event listener '${event}'`);
            emitter.removeListener(event.event, listener);
        };
    }

    toString() {
        return 'ApiSocketEvent class';
    }
}