'use strict';

import {ApiBusiness} from '../../component/api/business';
import ServerModel, {IServerModel} from './server.model';

import {DEBUG_BUSINESS_SERVER} from '../../config/logger';

export class ServerBusiness extends ApiBusiness<IServerModel> {
    constructor() {
        super(ServerModel, DEBUG_BUSINESS_SERVER);
    }

    toString() {
        return 'ServerBusiness class';
    }
}

let factory: ServerBusiness = new ServerBusiness();
export default factory;