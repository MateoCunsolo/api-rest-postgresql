const { Router } = require('express');
const router = Router();

const {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    createNewList,
    deleteList,
    updateNameList,
    getListForId,
    getMoviesForList,
    addMovieToList,
    deleteMovieFromList,
    createComment,
    updateNameUser,
    updateEmailUser,
    updatePasswordUser,
    getPassword,
    commentForIdMovie
} = require('../controllers/index.controller');

// Routes

router.get('/users', getUsers); // Get all users

router.get('/users/:id', getUserById); // Get user by id

router.delete('/users/:id', deleteUser); // Delete user by id

router.post('/users', createUser); // Create a new user

router.put('/users/:id', updateUser); // Update user by id

router.put('/users/:id/name', updateNameUser); // Update name user by id

router.put('/users/:id/email', updateEmailUser); // Update email user by id

router.put('/users/:id/password', updatePasswordUser); // Update password user by id

router.get('/users/:id/password', getPassword); // Get password user by id

router.post('/users/:id/lists', createNewList); // Create a new list for user by id

router.delete('/users/:id/lists/:idList', deleteList); // Delete list for user by id

router.put('/users/:id/lists/:idList', updateNameList); // Update name list for user by id

router.get('/users/:id/lists/:idList', getListForId); // Get list for user by id

router.get('/users/:id/lists/:idList/movies', getMoviesForList); // Get movies for list by id

router.post('/users/:id/lists/:idList/movies', addMovieToList); // Add movie to list by id

router.delete('/users/:id/lists/:idList/movies/:idMovie', deleteMovieFromList); // Delete movie from list by id

router.post('/users/:id/lists/:idList/movies/:idMovie/comments', createComment); // Create comment for movie by id

router.get('/users/:id/lists/:idList/movies/:idMovie/comments', commentForIdMovie); // Get comments for movie by id







module.exports = router;


