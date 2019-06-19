import _ from 'lodash/fp';
import * as operations from '../storage/user.operations';
import { IAuthUser } from '../routes/auth.routes';

export const validUsername = (username: string) => username && username.length > 1;

export const setUsername = (userId: string, username: string) =>
  operations.setNickame(userId, username);

export const getUsername = async (userId: string) =>
  (await operations.getUser(userId)).username || null;

const validateMessage = (message = '') => message.length > 0;

export const sendMessage = (userId: string, message: string) =>
  validateMessage(message) ? operations.sendMessage(userId, message) : false;

export const getMessages = async (user: IAuthUser) => {
  const messages = await operations.getMessages();
  const assignOwner = _.map<operations.IMessage, any>(m => ({
    ...m,
    owner: m.user_id === user.id
  }));
  const removeUserIds = _.map(_.omit('user_id'));
  const premareMessages = _.compose(
    removeUserIds,
    assignOwner
  );
  return premareMessages(messages);
};
