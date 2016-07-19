'use strict';

import * as mongoose from 'mongoose';
import {IUserModel, UserSchema} from './user.schema';

/**
 * 모델 객체 생성
 */
let UserModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);
export default UserModel;