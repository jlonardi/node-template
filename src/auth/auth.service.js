const _ = require('lodash');
const logger = require('../utils/logger');
const { getUser, addUser } = require('../user/user.operations');

const createUserIfNeeded = async authId => {
  const user = await getUser(authId);
  if (_.isEmpty(user)) {
    const newUser = await addUser(authId);
    logger.info(`Created user ${newUser.user_id}`);
    return true;
  }
  return false;
};

module.exports = {
  createUserIfNeeded
};
