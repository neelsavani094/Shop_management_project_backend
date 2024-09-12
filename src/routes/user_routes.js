const express = require('express');
const { getAllUser, createUser} = require('../controllers/userController');
const { profilePictureUpload } = require('../middlewares/multerMiddleware');
const router = express.Router();

router.get('/getAll', getAllUser);
router.post('/add', profilePictureUpload.single("profilePicture"),createUser);

module.exports = router;
