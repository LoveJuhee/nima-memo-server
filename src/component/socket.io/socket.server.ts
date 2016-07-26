'use strict';

import * as SocketIO from 'socket.io';
import * as express from 'express';

import {SocketClient, clientEventProcessor} from './socket.client';
import manager from './socket.client.manager';

class SocketServer {
    private _server: SocketIO.Server;
    private _useJwt: boolean;

    /**
     * Creates an instance of SocketServer. 
     * 웹페이지 전용으로 하나의 팩토리만 생성된다.
     * 
     * @param {(number | string | any)} key (port 또는 HttpServer 등)
     * @param {SocketIO.ServerOptions} [opt] 소켓 옵션
     * @param {boolean} [useJwt=false] JWT 사용여부
     */
    setServer(key: number | string | any, opt?: SocketIO.ServerOptions,
        useJwt: boolean = false) {
        this._useJwt = useJwt;
        this._server = SocketIO(key, opt);
        this._server
            .on('connection', (socket) => {
                let client = new SocketClient(socket);
                manager.addClient(client);
                if (clientEventProcessor.onConnect) {
                    clientEventProcessor.onConnect(client);
                }
            });
    }

    get server(): SocketIO.Server {
        return this._server;
    }

    get useJwt(): boolean {
        return this._useJwt;
    }

    toString() {
        return 'SocketServer class';
    }
}

/**
 * 타 클래스에서 사용하기 위한 팩토리 (초기 생성이 필요하다.)
 */
let factory: SocketServer = new SocketServer();
export default factory;
