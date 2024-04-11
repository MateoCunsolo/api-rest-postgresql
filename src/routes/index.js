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

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.post('/users', createUser);
router.put('/users/:id', updateUser);


router.post('/users/:id/lists', createNewList);
router.delete('/users/:id/lists/:idList', deleteList);
router.put('/users/:id/lists/:idList', updateNameList);
router.get('/users/:id/lists/:idList', getListForId);
router.get('/users/:id/lists/:idList/movies', getMoviesForList);
router.post('/users/:id/lists/:idList/movies', addMovieToList);
router.delete('/users/:id/lists/:idList/movies/:idMovie', deleteMovieFromList);
router.post('/users/:id/lists/:idList/movies/:idMovie/comments', createComment);
router.get('/users/:id/lists/:idList/movies/:idMovie/comments', commentForIdMovie);
router.put('/users/:id/name', updateNameUser);
router.put('/users/:id/email', updateEmailUser);
router.put('/users/:id/password', updatePasswordUser);
router.get('/users/:id/password', getPassword);





module.exports = router;


