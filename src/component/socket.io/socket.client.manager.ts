'use strict';

import {SocketClient} from './socket.client';

import objectUtil from '../util/object.util';

import {DEBUG_SOCKET_CLIENT_MANAGER} from '../../config/logger';
import {Debugger} from '../debugger';

export class SocketClientManager extends Debugger {
    private clients: SocketClient[] = [];

    constructor() {
        super(DEBUG_SOCKET_CLIENT_MANAGER);
    }

    /**
     * 클라이언트 추가
     * 
     * @param {SocketClient} client
     * @returns {number}
     */
    addClient(client: SocketClient): number {
        return this.clients.push(client);
    }

    /**
     * 클라이언트 제거
     * 
     * @param {string} id
     * @returns {SocketClient}
     */
    removeClientById(id: string): SocketClient {
        for (var i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === id) {
                return this.clients.splice(i, 1)[0];
            }
        }
    }

    /**
     * 클라이언트 제거
     * 
     * @param {string} uid
     * @returns {SocketClient}
     */
    removeClientByUid(uid: string): SocketClient {
        for (var i = 0; i < this.clients.length; i++) {
            if (this.clients[i].uid === uid) {
                return this.clients.splice(i, 1)[0];
            }
        }
    }

    /**
     * 소켓 ID 클라이언트에게 전송.
     * 
     * @param {string} id
     * @param {*} data
     * @returns {boolean}
     */
    sendById(id: string, data: any): boolean {
        let client = this.findById(id);
        if (client) {
            client.socket.emit('msg', data);
            return true;
        }
        return false;
    }

    /**
     * uid 클라이언트에게 전송.
     * 
     * @param {string} uid
     * @param {*} data
     * @returns {boolean}
     */
    sendByUid(uid: string, data: any): boolean {
        let client = this.findByUid(uid);
        if (client) {
            client.socket.emit('msg', data);
            return true;
        }
        return false;
    }

    /**
     * 모든 클라이언트에게 브로드캐스트 전파 
     * 
     * @param {*} data
     */
    broadcast(data: any): void {
        for (let client of this.clients) {
            client.socket.emit('msg', data);
        }
    }

    /**
     * UID를 가진 모든 클라이언트에게 브로드캐스트 전파 
     * 
     * @param {*} data
     */
    broadcastHasUid(data: any): void {
        for (let client of this.clients) {
            if (client.uid) {
                client.socket.emit('msg', data);
            }
        }
    }

    /**
     * uid이 있는 다른 클라이언트에 브로드캐스트 전파
     * 
     * @param {string} uid 이벤트 전송 클라이언트
     * @param {*} data
     */
    broadcastByUid(uid: string, data: any): void {
        for (let client of this.clients) {
            if (client.uid && client.uid !== uid) {
                client.socket.emit('msg', data);
            }
        }
    }

    /**
     * 소켓 ID 기반으로 클라이언트 찾기 
     * 
     * @param {string} id
     * @returns {SocketClient}
     */
    findById(id: string): SocketClient {
        for (let client of this.clients) {
            if (client.id === id) {
                return client;
            }
        }
    }

    /**
     * uid 기반으로 클라이언트 찾기 
     * 
     * @param {string} uid
     * @returns {SocketClient}
     */
    findByUid(uid: string): SocketClient {
        for (let client of this.clients) {
            if (client.uid === uid) {
                return client;
            }
        }
    }

    toString() {
        return objectUtil.inspect(this.clients, false, 1);
    }
}

/**
 * uid 값이 있는 클라이언트만 관리하는 객체
 */
let factory = new SocketClientManager();
export default factory;