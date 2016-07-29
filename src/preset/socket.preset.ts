'use strict';

import {SocketClient, clientEventProcessor} from '../component/socket.io/socket.client';
import manager from '../component/socket.io/socket.client.manager';

import serverSocketEvent from '../api/server/server.socket.event';
import userSocketEvent from '../api/user/user.socket.event';

clientEventProcessor.onConnect = onConnect;
clientEventProcessor.onDisconnect = onDisconnect;

import {DEBUG} from '../config/logger';
import * as debugClass from 'debug';
let debug: debug.IDebugger = debugClass(DEBUG);

/**
 * 소켓 클라이언트 접속해제 시 동작할 부분 
 * 
 * @param {SocketClient} client
 */
function onDisconnect(client: SocketClient): void { }

/**
 * 소켓 클라이언트 접속 시 사용할 부분
 * api / socket 연결을 추가한다.
 * 
 * @param {SocketClient} client
 */
function onConnect(client: SocketClient): void {
    let socket = client.socket;
    // When the client emits 'info', this listens and executes
    socket.on('info', function (data: any): void {
        let socket = this;
        let client = manager.findById(socket.id);
        if (client) {
            client.debugger(`${client.address} ${JSON.stringify(data, null, 2)}`);
        } else {
            debug(`manager.findById(${socket.id}) is null or undefined`)
        }
    });

    // When the client emits 'info', this listens and executes
    socket.on('list', function (data: any): void {
        debug(manager.toString());
    });

    // 소켓 이벤트 추가 처리
    serverSocketEvent.register(client);
    userSocketEvent.register(client);
}
