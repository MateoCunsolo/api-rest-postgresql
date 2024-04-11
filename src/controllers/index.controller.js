
//conection to postgres db

const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgresql_mateo',
    password: 'd7egmYblZWRwEV4iU5piZiO0OKOxCXyU',
    host: 'dpg-coc1bbocmk4c73ahn5rg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'flick_finder_db',
    ssl: {
      rejectUnauthorized: false // Configuración para permitir la conexión SSL
    }
  });


const getUsers = async (req, res) => {
    // const response = await pool.query('SELECT * FROM "user"')
    // res.status(200).json(response.rows);
    res.json('users');
}

const getUserById = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM "user" WHERE id = $1', [id]);
    res.json(response.rows);
}

const createUser = async (req, res) => {
    const { username, email, password} = req.body;
    const response = await pool.query('INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
    console.log(response);
    res.json({
        message: 'User Added Successfully',
        body: {
            user: {username, email}
        }
    })
    
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM "user" WHERE id = $1', [id]);
    res.json(`User ${id} deleted Successfully`);
}


const updateUser = async (req, res) => {
    const id = req.params.id;
    const { username, email, password} = req.body;
    const response = await pool.query('UPDATE "user" SET username = $1, email = $2, password = $3 WHERE id = $4', [
        username,
        email,
        password,
        id
    ]);
    res.json('User Updated Successfully');

}


module.exports = {
    getUsers, createUser, getUserById, deleteUser, updateUser
}