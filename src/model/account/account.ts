'use strict';

import * as mongoose from 'mongoose';
import {IAccountModel, AccountSchema} from './account-schema';

/**
 * 팩토리 생성
 */
let Account: mongoose.Model<IAccountModel>;
Account = mongoose.model<IAccountModel>('Account', AccountSchema);
export default Account;