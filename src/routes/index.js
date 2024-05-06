const { Router } = require('express');
const router = Router();

const {
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
    commentForIdMovie
} = require('../controllers/index.controller');


// Routes USER
router.get('/users', getUsers); // Get all users
router.get('/users/:id', getUserById); // Get user by id
router.post('/users', createUser); // Create a new user
router.delete('/users/:id', deleteUser); // Delete user by id
router.put('/users/:id/UpdateUserEmail', UpdateUserEmail); // Update email user by id
router.put('/users/:id/UpdateUserName', UpdateUserName); // Update name user by id
router.put('/users/:id/UpdatedUserPassword', UpdatedUserPassword); // Update password user by id

// Routes COMMENTS
router.post('/users/:id/AddComment', AddComment); // Create comment for movie by id
router.get('/users/comments/:idMovie', commentForIdMovie); // Get comments for movie by id

// Routes LIST
router.post('/users/:id/:list', createNewList); // Create a new list for user by id
router.delete('/users/:id/deleteList', deleteList); // Delete list for user by id
router.put('/users/:id/UpdateNameList', updateNameList); // Update name list for user by id

router.get('/users/list/:id', getListForId); // Get list for user by id
router.get('/users/list/:id/:list', getMoviesForList); // Get movies for list by id
router.post('/users/:id/:list/:idMovie', addMovieToList); // Add movie to list by id
router.delete('/users/:id/:list/:idMovie', deleteMovieFromList); // Delete movie from list by id












module.exports = router;


