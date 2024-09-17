const express = require('express');
const { profilePictureUpload } = require('../middlewares/multerMiddleware');
const { loginAdmin, createUser, getAllUser, updateAdmin } = require('../controllers/adminController');
const { updateUser } = require('../controllers/userController');
const router = express.Router();


router.post('/login', loginAdmin);
router.put('/update/:id', profilePictureUpload.single("profilePicture"), updateAdmin);
router.post('/add/Customer', profilePictureUpload.single("profilePicture"),createUser);
router.put('/update/Customer/:id', profilePictureUpload.single("profilePicture"),updateUser);
router.get('/getAll/Customer', getAllUser);


module.exports = router;