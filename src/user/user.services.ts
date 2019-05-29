import * as operations from './user.operations';

export const validUsername = (username: string) => username && username.length > 1;

export const setUsername = (userId: string, username: string) =>
  operations.setNickame(userId, username);

export const getUsername = async (userId: string) =>
  (await operations.getUser(userId)).username || null;

const validateMessage = (message = '') => message.length > 0;

export const sendMessage = (userId: string, message: string) =>
  validateMessage(message) ? operations.sendMessage(userId, message) : false;

export const getMessages = () => operations.getMessages();
