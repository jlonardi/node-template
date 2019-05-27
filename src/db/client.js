const { Pool, Client } = require('pg');
const named = require('node-postgres-named');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const dbClient = new Client({
  connectionString: process.env.DATABASE_URL
});

const queryAsyncWithTx = async (tx, queryString, values) =>
  tx.query(queryString, values).then(res => res.rows);

const getQueryAsyncWithTx = client => ({
  queryAsync: (queryString, values) => queryAsyncWithTx(client, queryString, values)
});

const getConnection = async fn => {
  const client = await pool.connect();
  named.patch(client);
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

const queryAsync = (queryString, values) =>
  getConnection(client => client.queryAsync(queryString, values));

pool.on('error', err => {
  logger.error('An idle client has experienced an error', err.stack);
});

module.exports = {
  getConnection,
  client: dbClient,
  queryAsync
};
