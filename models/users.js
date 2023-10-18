const usersModel = {
  getAll:`
      SELECT
          *
      FROM
          Users
  `,
  getByID: `
  SELECT
  *
  FROM
      Users
  WHERE
      id = ?
  `,
  getByUsername: `
  SELECT
  *
  FROM
      Users
  WHERE
      usersname = ?
  `,
  getByEmail: `
  SELECT
  *
  FROM
      Users
  WHERE
      email = ?
  `,
  addRow:`
  INSERT INTO
      users (
          usersname,
          password,
          email,
          name,
          lastname,
          phonenumber,
          role_id,
          is_active
      ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
      )
  `,
  
}

module.exports = usersModel;