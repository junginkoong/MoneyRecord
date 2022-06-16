module.exports = {
    checkUserLogIn: `SELECT id FROM users_account WHERE email = $1 AND password = crypt($2, password);`,
  }