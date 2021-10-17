import { queryAsync, queryRowsAsync } from '../db-client/postgres';

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

export const getUser = (userId: string): Promise<IUser> =>
  queryAsync(
    `
      SELECT user_id, username, picture
      FROM users
      WHERE user_id = $userId`,
    { userId }
  );

export const addUser = async (userId: string, picture: string): Promise<IUser> =>
  queryAsync(
    `
      INSERT INTO users (user_id, picture)
      VALUES ($userId, $picture)
      RETURNING user_id, username, picture`,
    { userId, picture }
  );

export const setNickame = async (userId: string, username: string): Promise<IUser> =>
  queryAsync(
    `
      UPDATE users
      SET username = $username
      WHERE user_id = $userId
      RETURNING user_id, username`,
    { userId, username }
  );

export const sendMessage = async (userId: string, message: string): Promise<IMessage> =>
  queryAsync(
    `
      INSERT INTO public.messages(user_id, message)
      VALUES (
        (SELECT user_id FROM users WHERE user_id = $userId),
        $message)
      RETURNING created_at, message, message_id`,
    { userId, message }
  );

export const getMessages = async (): Promise<IMessage[]> =>
  queryRowsAsync(
    `SELECT user_id, username, picture, message, message_id, messages.created_at FROM messages NATURAL JOIN users
      ORDER BY created_at DESC`
  );
