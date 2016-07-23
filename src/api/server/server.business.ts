'use strict';

import {CommonBusiness} from '../../component/business/common.business';
import ServerModel, {IServerModel} from './server.model';

import {DEBUG_BUSINESS_SERVER} from '../../config/logger';

export class ServerBusiness extends CommonBusiness<IServerModel> {
    constructor() {
        super(ServerModel, DEBUG_BUSINESS_SERVER);
    }

    toString() {
        return 'ServerBusiness class';
    }
}

let factory: ServerBusiness = new ServerBusiness();
export default factory;