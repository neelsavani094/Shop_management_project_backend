const express = require('express');
const { profilePictureUpload } = require('../middlewares/multerMiddleware');
const { loginUser, updateUser } = require('../controllers/userController');
const router = express.Router();

router.post('/login', loginUser);
router.put('/update/:id', profilePictureUpload.single("profilePicture"), updateUser);

module.exports = router;
