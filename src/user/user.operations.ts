import { logger } from '../utils/logger';
import { queryAsync, queryRowsAsync } from '../db/client';
import { SQLError } from '../errors/sql-error';

export interface IMessage {
  message: string;
  message_id: string;
  created_at: string;
  user_id: string;
}

export interface IUser {
  user_id: string;
  username: string;
}

export const getUser = async (userId: string): Promise<IUser> => {
  try {
    const res = await queryAsync(
      `
      SELECT user_id, username, picture
      FROM users
      WHERE user_id = $userId`,
      { userId }
    );
    return res;
  } catch (error) {
    logger.error(error);
    throw new SQLError(error);
  }
};

export const addUser = async (userId: string, picture: string): Promise<IUser> => {
  try {
    const res = await queryAsync(
      `
      INSERT INTO users (user_id, picture)
      VALUES ($userId, $picture)
      RETURNING user_id, username, picture`,
      { userId, picture }
    );
    return res;
  } catch (error) {
    logger.error(error);
    throw new SQLError(error);
  }
};

export const setNickame = async (userId: string, username: string): Promise<IUser> => {
  try {
    const res = await queryAsync(
      `
      UPDATE users
      SET username = $username
      WHERE user_id = $userId
      RETURNING user_id, username`,
      { userId, username }
    );
    return res;
  } catch (error) {
    logger.error(error);
    throw new SQLError(error);
  }
};

export const sendMessage = async (userId: string, message: string): Promise<IMessage> => {
  try {
    const res = await queryAsync(
      `
      INSERT INTO public.messages(user_id, message)
      VALUES (
        (SELECT user_id FROM users WHERE user_id = $userId),
        $message)
      RETURNING created_at, message, message_id`,
      { userId, message }
    );
    return res;
  } catch (error) {
    logger.error(error);
    throw new SQLError(error);
  }
};

export const getMessages = async (): Promise<IMessage[]> => {
  try {
    const res = await queryRowsAsync(
      `SELECT user_id, username, picture, message, message_id, messages.created_at FROM messages NATURAL JOIN users
      ORDER BY created_at DESC`
    );
    return res;
  } catch (error) {
    logger.error(error);
    throw new SQLError(error);
  }
};
