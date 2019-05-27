const operations = require('./user.operations');

const validUsername = username => username && username.length > 1;

const setUsername = (authId, username) => operations.setNickame(authId, username);

const getUsername = async authId => (await operations.getUser(authId)).username || null;

const validateMessage = (message = '') => message.length > 0;

const sendMessage = (authId, message) =>
  validateMessage(message) ? operations.sendMessage(authId, message) : false;

const getMessages = () => operations.getMessages();

module.exports = {
  setUsername,
  getUsername,
  validUsername,
  sendMessage,
  getMessages
};
