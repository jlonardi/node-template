// tslint:disable-next-line:no-var-requires
require('dotenv').config();
import { Pool, QueryResult } from 'pg';
import named, { IQueryObject, PatchedClient } from 'node-postgres-named';
import { SQLError } from '../errors/sql-error';
import { logger } from '../utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

interface IAsyncClient {
  queryAsync(queryString: string, values?: IQueryObject): Promise<any>;
}

const queryAsyncWithTx = async (tx: PatchedClient, queryString: string, values?: IQueryObject) => {
  const res: QueryResult = await tx.query(queryString, values);
  return res.rows;
};

const logQuery = (queryString: string, values?: IQueryObject) => {
  logger.info('SQL query string:');
  logger.info(queryString);
  logger.info('Passed values:', values);
};

const getQueryAsyncWithTx = (client: PatchedClient) => ({
  queryAsync: (queryString: string, values?: IQueryObject) => {
    logQuery(queryString, values);
    return queryAsyncWithTx(client, queryString, values);
  }
});

const getConnection = async <T>(fn: (client: IAsyncClient) => Promise<T[]> | Promise<T>) => {
  const originalClient = await pool.connect();
  const client = named.patch(originalClient);
  try {
    await client.query('BEGIN');
    const result = await fn(getQueryAsyncWithTx(client));
    await client.query('COMMIT');

    return result;
  } catch (error) {
    logger.error('Transaction failed. Rollbacking tranasction.');
    await client.query('ROLLBACK');
    logger.error(error);
    throw new SQLError(error as string);
  } finally {
    client.release();
  }
};

export const queryRowsAsync = (queryString: string, values?: IQueryObject): Promise<any[]> =>
  getConnection((client: IAsyncClient) => client.queryAsync(queryString, values));

export const queryAsync = (queryString: string, values?: IQueryObject): Promise<any> =>
  getConnection(async (client: IAsyncClient) => {
    const rows = await client.queryAsync(queryString, values);
    return rows[0];
  });

pool.on('error', (err: Error) => {
  logger.error('An idle client has experienced an error', err.stack);
});
