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
    getByUsersname: `
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
    updateRow: `
    UPDATE
        users
    SET
        usersname = ?,
        password = ?,
        email = ?,
        name = ?,
        lastname = ?,
        phonenumber = ?,
        role_id = ?,
        is_active = ?
    WHERE
        id = ?
`,
    deleteRow: `
            UPDATE
                users
            SET
                is_active = 0
            WHERE
                id = ?
    `,
}

module.exports = usersModel;