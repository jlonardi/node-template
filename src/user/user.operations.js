const logger = require('./../utils/logger');
const db = require('../db/client');

const getUser = async authId => {
  try {
    const [res] = await db.queryAsync(
      `
      SELECT user_id, username
      FROM users
      WHERE auth_id = $auth_id`,
      { auth_id: authId }
    );
    return res;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const addUser = async authId => {
  try {
    const [res] = await db.queryAsync(
      `
      INSERT INTO users (auth_id)
      VALUES ($auth_id)
      RETURNING user_id`,
      { auth_id: authId }
    );
    return res;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const setNickame = async (authId, username) => {
  try {
    const [res] = await db.queryAsync(
      `
      UPDATE users
      SET username = $username
      WHERE auth_id = $auth_id
      RETURNING username`,
      { auth_id: authId, username }
    );
    return res;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const sendMessage = async (authId, message) => {
  try {
    const [res] = await db.queryAsync(
      `
      INSERT INTO public.messages(user_id, message)
      VALUES (
        (SELECT user_id FROM users WHERE auth_id = $auth_id),
        $message)
      RETURNING created_at, message`,
      { auth_id: authId, message }
    );
    return res;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const getMessages = async () => {
  try {
    const res = await db.queryAsync(
      `SELECT username, message, message_id, messages.created_at FROM messages NATURAL JOIN users
      ORDER BY created_at DESC`
    );
    return res;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

module.exports = {
  getUser,
  addUser,
  setNickame,
  sendMessage,
  getMessages
};
