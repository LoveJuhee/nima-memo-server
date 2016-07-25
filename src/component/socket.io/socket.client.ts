'use strict';

import * as SocketIO from 'socket.io';

import manager from './socket.client.manager';

import {DEBUG_SOCKET_CLIENT} from '../../config/logger';
import {Debugger} from '../debugger';

import objectUtil from '../util/object.util';

/**
 * 소켓 서버의 이벤트를 처리하도록 도와주는 객체
 */
export let clientEventProcessor: any = {
    onConnect: Function = undefined,
    onDisconnect: Function = undefined,
};

export class SocketClient extends Debugger {
    private _socket: SocketIO.Socket;
    private _address: string;
    private _connectedAt: Date;
    private _id: string; // socket id
    private _uid: string; // 로그인 후, 클라이언트를 구분하는 키 (ex: email)

    /**
     * Creates an instance of SocketClient.
     * 소켓에 대한 기능을 추가한 객체
     * 
     * @param {SocketIO.Socket} client
     */
    constructor(client: SocketIO.Socket) {
        if (!client) {
            throw 'client is not instance.';
        }

        super(DEBUG_SOCKET_CLIENT);

        this._socket = client;
        this._address = client.request.connection.remoteAddress + ':' + client.request.connection.remotePort;
        this._connectedAt = new Date();
        this._id = client.id;

        this.setEvent();
    }

    /**
     * 멤버 변수 정리
     */
    reset(): void {
        this._id = this._uid = this._address = this._socket = this._connectedAt = undefined;
    }

    /**
     * 소켓 이벤트 연결
     * 
     * @private
     */
    private setEvent(): void {
        // 접속해제 시, 관리객체에서 제거 및 종료 로직 수행
        this.socket.on('disconnect', function (data: any): void {
            let socket = this;
            let client = manager.removeClientById(socket.id);
            if (client) {
                client.debugger(`${client.address} DISCONNECTED`);
                if (clientEventProcessor.onDisconnect) {
                    clientEventProcessor.onDisconnect(client);
                }
                client.reset();
            }
        });

        // 로그인 시, uid 설정
        this.socket.on('login', function (data: any): void {
            let socket = this;
            let client = manager.findById(socket.id);
            if (client) {
                client.debugger(`${client.address} login : ${objectUtil.inspect(data, false, 2, true)}`);
                if (data.uid) {
                    client.uid = data.uid;
                } else {
                    client.debugger(`data.uid is invalid.`);
                }
            }
        });

        // 로그아웃 시, uid 제거
        this.socket.on('logout', function (data: any): void {
            let socket = this;
            let client = manager.findById(socket.id);
            if (client) {
                client.debugger(`${client.address} logout`);
                client._uid = '';
            }
        });
    }

    /**
     * 클라이언트 소켓
     * 
     * @readonly
     * @type {SocketIO.Socket}
     */
    get socket(): SocketIO.Socket {
        return this._socket;
    }

    /**
     * 클라이언트 주소
     * 
     * @readonly
     * @type {string}
     */
    get address(): string {
        return this._address;
    }

    /**
     * 접속시간
     * 
     * @readonly
     * @type {Date}
     */
    get connectedAt(): Date {
        return this._connectedAt;
    }

    /**
     * 로그인 후, 클라이언트를 구분 짓는 값 (email 등)
     * 
     * @readonly
     * @type {string}
     */
    set uid(v: string) {
        this._uid = v;
    }

    /**
     * 로그인 후, 클라이언트를 구분 짓는 값 (email 등)
     * 
     * @readonly
     * @type {string}
     */
    get uid(): string {
        return this._uid;
    }

    /**
     * 소켓 ID 반환 
     * 
     * @readonly
     * @type {string}
     */
    get id(): string {
        return this._id;
    }

    toString() {
        return 'SocketClient class';
    }
}