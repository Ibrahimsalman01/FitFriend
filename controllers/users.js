const pool = require('../utils/database_connection');

const createUser = async (username, password, email) => {
  try {
    const queryCreateUser =
    `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, 'member');
    `;
  
    await pool.query(queryCreateUser, [username, email, password]);
    console.log('User successfully created.');
  } catch (error) {
    console.error('Error creating user: ', error);
  }
}

const userLogin = async (username, password) => {
  try {
    const queryLogin =
    `
    SELECT
      *
    FROM
      users
    WHERE
      username = $1
    AND
      password = $2;
    `;

    const response = await pool.query(queryLogin, [username, password]);
    const user = response.rows[0];
    return user;
  } catch (error) {
    console.error('Error logging in: ', error);
  }
}

module.exports = {
  createUser,
  userLogin
}