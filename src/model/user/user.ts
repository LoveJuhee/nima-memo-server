'use strict';

import * as mongoose from 'mongoose';
import {IUserModel, UserSchema} from './user-schema';

/**
 * 모델 생성
 */
let User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);
export default User;