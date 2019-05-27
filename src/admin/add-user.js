require('dotenv').config();
const generator = require('generate-password');
const db = require('../db/client');

const args = process.argv
  .slice(2)
  .map(arg => arg.split('='))
  .reduce((acc, [value, key]) => {
    return { ...acc, [value]: key };
  }, {});

const { customer } = args;

const addUser = async customerName => {
  const passkey = generator.generate({
    length: 10,
    numbers: true
  });
  try {
    const [res] = await db.queryAsync(
      `INSERT INTO customers (customer_name, passkey)
        VALUES ($1, $2)
        RETURNING customer_name, passkey`,
      [customerName, passkey]
    );
    console.log(res);
    console.log(`Customer "${res.customer_name}" added.`);
    console.log(`Passkey generated: ${res.passkey}`);
  } catch (error) {
    console.log(error);
  }
};

addUser(customer);
