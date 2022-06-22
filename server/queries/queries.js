module.exports = {
    checkUserLogIn: `SELECT id 
                      FROM users_account 
                      WHERE email = $1 AND password = crypt($2, password);`,
    addUser: `INSERT into users_account(email, password, first_name, last_name) 
              VALUES ($1, crypt($2, gen_salt('bf')), $3, $4);`,
  }