'use strict';

import {ApiBusiness} from '../../component/api/business';
import MemoModel, {IMemoModel} from './memo.model';

import {DEBUG_BUSINESS_MEMO} from '../../config/logger';

export class MemoBusiness extends ApiBusiness<IMemoModel> {
    constructor() {
        super(MemoModel, DEBUG_BUSINESS_MEMO);
    }

    toString() {
        return 'MemoBusiness class';
    }
}

let factory: MemoBusiness = new MemoBusiness();
export default factory;