'use strict';

import * as mongoose from 'mongoose';
import {IAccountModel, AccountSchema} from './account-schema';

/**
 * 팩토리 생성
 */
let AccountFactory: mongoose.Model<IAccountModel>;
AccountFactory = mongoose.model<IAccountModel>('Account', AccountSchema);
export default AccountFactory;