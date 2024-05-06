
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
    try {
        const response = await pool.query('SELECT id, userName, email, password FROM "user"')
        if (response.rows.length === 0) {
            res.status(404).json({
                message: 'DB is empty'
            });
        } else {
            res.status(200).json(response.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query('SELECT username, email FROM "user" WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            res.status(200).json(response.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const createUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Verificar si el usuario ya existe por su correo electrónico
        const userExistsResponse = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (userExistsResponse.rows.length > 0) {
            console.log("The user already exists");
            return res.status(409).json({ error: "The user already exists" });
        }

        // Insertar el nuevo usuario en la tabla "user"
        const newUserResponse = await pool.query('INSERT INTO "user" (userName, email, password) VALUES ($1, $2, $3) RETURNING id', [userName, email, password]);
        const userId = newUserResponse.rows[0].id;

        // Insertar listas predeterminadas para el nuevo usuario
        await pool.query('INSERT INTO "list" (name, id_user) VALUES ($1, $2)', ['ToWatch', userId]);
        await pool.query('INSERT INTO "list" (name, id_user) VALUES ($1, $2)', ['Watched', userId]);

        // Imprimir los detalles del usuario en la consola
        console.log("Usuario creado:", { userName, email }, "ID:", userId);

        return res.status(201).json({ message: "User Saved" });
    } catch (error) {
        console.error("Error in user creation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userResponse = await pool.query('SELECT id FROM "user" WHERE id = $1', [id]);
        if (userResponse.rows.length === 0) {
            return res.status(404).json({ error: 'The user does not exist' });
        } else {
            await pool.query('DELETE FROM movie_x_list WHERE list_id IN (SELECT id FROM "list" WHERE id_user = $1)', [id]);
            await pool.query('DELETE FROM "list" WHERE id_user = $1', [id]);
            await pool.query('DELETE FROM comment_x_user WHERE user_id = $1', [id]);
            await pool.query('DELETE FROM "user" WHERE id = $1', [id]);
        }
        return res.status(200).json({ message: 'The user was deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const createNewList = async (req, res) => {
    try {
        const { id } = req.params;
        const { list } = req.params;
        console.log(id, list);
        const response = await pool.query('INSERT INTO "list" (id_user, name) VALUES ($1, $2)', [id, list]);
        res.status(201).json({ message: 'New list created' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteList = async (req, res) => {
    try {
        const { id } = req.params;
        const { list } = req.body;
        const  response1 = await pool.query('DELETE FROM movie_x_list WHERE list_id IN (SELECT id FROM "list" WHERE name = $1 AND id_user = $2)', [list, id])
        const response = await pool.query('DELETE FROM "list" WHERE name = $1 AND id_user = $2', [list, id]);

        if (response.rowCount === 0) {
            res.status(404).json({ message: 'List not found for the specified user' });
        }else
            res.json({ message: 'List deleted successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateNameList = async (req, res) => {
    try {
        const { id } = req.body;
        let { list } = req.body;
        const { newName } = req.body;
        console.log(id, list, newName);
        list = list.replace(/[^a-zA-Z0-9]/g, ''); // Limpiar de espacios y caracteres especiales

        const response = await pool.query('UPDATE "list" SET name = $1 WHERE id_user = $2 AND name = $3', [newName, id, list]);
        if (response.rowCount === 0) {
            res.status(404).json({ message: 'List not found for the specified user' });
        } else {
            res.json({ message: 'List name updated successfully' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getListForId = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pool.query('SELECT name FROM "list" WHERE id_user = $1', [id]);
        res.json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getMoviesForList = async (req, res) => {
    try {
        const { id, list } = req.params;
        const idList = await pool.query('SELECT id FROM "list" WHERE id_user = $1 AND name = $2', [id, list]);
        const response = await pool.query('SELECT id_movie FROM movie_x_list WHERE list_id = $1', [idList.rows[0].id]);
        if(response.rows.length === 0) {
            res.json({ message: 'No movies found for the specified list',list: list, user_id:id});
            return;
        }
        res.json(response.rows);
    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const addMovieToList = async (req, res) => {
    try {
        const id = req.params.id;
        const list = req.params.list;
        const idMovie = req.params.idMovie;
        const response1 = await pool.query('SELECT id FROM "list" WHERE id_user = $1 AND name = $2', [id, list]);
        if (response1.rows.length === 0) {
            res.status(404).json({ message: 'List not found for the specified user' });
            return;
        }   

        const listId = response1.rows[0].id;

        const response2 = await pool.query('SELECT * FROM movie_x_list WHERE list_id = $1 AND id_movie = $2', [listId, idMovie]);
        if (response2.rows.length > 0) {
            res.status(409).json({ message: 'The movie already exists in the list' });
            return;
        }

        await pool.query('INSERT INTO movie_x_list (list_id, id_movie) VALUES ($1, $2)', [listId, idMovie]);
        res.status(201).json({ message: 'Movie added to list' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteMovieFromList = async (req, res) => {
    try {
        const { id } = req.params;
        const { list } = req.params;
        const { idMovie } = req.params;
        const response1 = await pool.query('SELECT id FROM "list" WHERE id_user = $1 AND name = $2', [id, list]);
        if (response1.rows.length === 0) {
            res.status(404).json({ message: 'List not found for the specified user' });
            return;
        }

        const listId = response1.rows[0].id;

        const response2 = await pool.query('SELECT * FROM movie_x_list WHERE list_id = $1 AND id_movie = $2', [listId, idMovie]);
        if (response2.rows.length === 0) {
            res.status(404).json({ message: 'The movie does not exist in the list' });
            return;
        }

        await pool.query('DELETE FROM movie_x_list WHERE list_id = $1 AND id_movie = $2', [listId, idMovie]);
        res.json({ message: 'Movie deleted from list' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const AddComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const { idMovie } = req.body;
        const response2 = await pool.query('INSERT INTO comment_x_user (text, user_id, id_movie) VALUES ($1, $2, $3)', [text, id, idMovie]);
        if (response2.rowCount === 0) {
            res.status(404).json({ message: 'User not found' });
        }else
            res.status(201).json({ message: 'Comment added successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const UpdateUserName = async (req, res) => {
    try {
        const { id } = req.params;
        const { newUsername } = req.body;
        const response = await pool.query('UPDATE "user" SET username = $1 WHERE id = $2', [newUsername, id]);
        if (response.rowCount === 0) {
            res.status(404).json({ message: `User ${id} not found` });
        } else {
            res.json({ message: `Username updated successfully for user ${id}` }); 
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const UpdateUserEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { newEmail } = req.body;
        const response = await pool.query('UPDATE "user" SET email = $1 WHERE id = $2', [newEmail, id]);
        if (response.rowCount === 0) {
            res.status(404).json({ message: `User ${id} not found` }); // Corregimos la interpolación
        } else {
            res.json({ message: `Email updated successfully for user ${id}` }); // Corregimos la interpolación
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const UpdatedUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        const response = await pool.query('UPDATE "user" SET password = $1 WHERE id = $2', [newPassword, id]);
        if (response.rowCount === 0) {
            res.status(404).json({ message: `User ${id} not found` }); // Corregimos la interpolación
        } else {
            res.json({ message: `Password updated successfully for user ${id}` }); // Corregimos la interpolación
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pool.query('SELECT password FROM "user" WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            res.status(404).json({ message: `User ${id} not found` }); // Corregimos la interpolación
        } else {
            res.json(response.rows[0]);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const commentForIdMovie = async (req, res) => {
    try {
        const { idMovie } = req.params;
        const response = await pool.query('SELECT cu.text, u.username FROM comment_x_user cu JOIN "user" u ON cu.user_id = u.id WHERE cu.id_movie = $1', [idMovie]);
        if (response.rows.length === 0) {
            res.status(404).json({ message: 'No comments found for the given movie ID' });
        } else {
            res.json(response.rows);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    createNewList,
    deleteList,
    updateNameList,
    getListForId,
    getMoviesForList,
    addMovieToList,
    deleteMovieFromList,
    AddComment,
    UpdateUserName,
    UpdateUserEmail,
    UpdatedUserPassword,
    getPassword,
    commentForIdMovie
}