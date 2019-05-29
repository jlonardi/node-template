import _ from 'lodash';
import { logger } from '../utils/logger';
import { getUser, addUser } from '../user/user.operations';
import { IAuthUser } from './auth.routes';

export const createUserIfNeeded = async (authenticatedUser: IAuthUser) => {
  const user = await getUser(authenticatedUser.id);
  if (_.isEmpty(user)) {
    const newUser = await addUser(authenticatedUser.id, authenticatedUser.picture || '');
    logger.info(`Created user ${newUser.user_id}`);
    return true;
  }
  return false;
};
