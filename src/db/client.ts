import { Pool, QueryResult } from 'pg';
import named, { IQueryObject, PatchedClient } from 'node-postgres-named';
import { logger } from '../utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

interface IAsyncClient {
  queryAsync(queryString: string, values?: IQueryObject): Promise<any[]>;
}

const queryAsyncWithTx = async (tx: PatchedClient, queryString: string, values?: IQueryObject) =>
  tx.query(queryString, values).then((res: QueryResult) => res.rows);

const getQueryAsyncWithTx = (client: PatchedClient) => ({
  queryAsync: (queryString: string, values?: IQueryObject) =>
    queryAsyncWithTx(client, queryString, values)
});

const getConnection = async (fn: (client: IAsyncClient) => Promise<any[]>) => {
  const originalClient = await pool.connect();
  const client = named.patch(originalClient);
  try {
    await client.query('BEGIN');
    const result = await fn(getQueryAsyncWithTx(client));
    await client.query('COMMIT');

    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const queryRowsAsync = (queryString: string, values?: IQueryObject) =>
  getConnection((client: IAsyncClient) => client.queryAsync(queryString, values));

export const queryAsync = (queryString: string, values?: IQueryObject) =>
  getConnection((client: IAsyncClient) => client.queryAsync(queryString, values)).then(
    rows => rows[0]
  );

pool.on('error', err => {
  logger.error('An idle client has experienced an error', err.stack);
});
