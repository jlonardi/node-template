require('dotenv').config();
const db = require('../db/client');

const truncate = s => (s.length > 20 ? `${s.substring(0, 17)}...` : s);

const getUsers = async () => {
  try {
    const res = await db.queryAsync(
      `SELECT customer_name, passkey
    FROM customers`
    );
    const formatted = res.reduce(
      (acc, { customerName, passkey }) =>
        `${acc}\n${truncate(customerName) +
          ' '.repeat(20 - truncate(customerName).length)} -> ${passkey}`,
      'User passkeys:'
    );
    console.log(formatted);
  } catch (error) {
    console.log(error.detail);
  }
};

getUsers();
