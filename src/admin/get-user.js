require('dotenv').config();
const db = require('../db/client');

const args = process.argv
  .slice(2)
  .map(arg => arg.split('='))
  .reduce((acc, [value, key]) => {
    return { ...acc, [value]: key };
  }, {});

const { passkey } = args;

const getUser = async key => {
  try {
    const [res] = await db.queryAsync(
      `
      SELECT customer_name
      FROM customers
      WHERE passkey = $1`,
      [key]
    );
    console.log(res);
  } catch (error) {
    console.log(error.detail);
  }
};

getUser(passkey);
