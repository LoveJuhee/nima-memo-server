'use strict';

import {CommonBusiness} from '../common/common-business';
import User from '../../model/user/user';
import {IUserModel} from '../../model/user/user-schema';

export default class UserBusiness extends CommonBusiness<IUserModel> {
    constructor() {
        super(User);
    }

    toString() {
        return 'UserBusiness class';
    }
}