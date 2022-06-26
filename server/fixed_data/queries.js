module.exports = {
    checkUserLogIn: `SELECT id 
                      FROM users_account 
                      WHERE email = $1 AND password = crypt($2, password);`,
    addUser: `INSERT INTO users_account(email, password, first_name, last_name) 
              VALUES ($1, crypt($2, gen_salt('bf')), $3, $4);`,
    getFriend: `SELECT id, name
                FROM friends
                WHERE user_id = $1;`,
    savePersonalRecord: `INSERT INTO personal_records(user_id, category, amount, date)
                        VALUES ($1, $2, $3, $4);`,
    savePersonalRecordFriend: `INSERT INTO personal_record_friends(user_id, amount, date, friend_id)
                                VALUES ($1, $2, $3, $4);`,
    getHistoricalPersonalRecord: `SELECT amount, date
                                    FROM personal_records
                                    WHERE user_id = $1;`,
    addFriend: `INSERT INTO friends(user_id, name)
                VALUES ($1, $2);`,
    getHistoricalPersonalRecordFriend: `SELECT prf.amount, prf.date, f.name
                                        FROM personal_record_friends prf LEFT JOIN friends f
                                        ON prf.friend_id = f.id
                                        WHERE prf.user_id = $1;`
  }