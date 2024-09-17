const express = require('express');
const { profilePictureUpload } = require('../middlewares/multerMiddleware');
const { getAllSuperAdmin, createSuperAdmin, loginSuperAdmin, updateSuperAdmin, createAdmin, getAllAdmin, updateAdmin } = require('../controllers/superAdminController');
const router = express.Router();

router.get('/getAll', getAllSuperAdmin);
router.post('/login', loginSuperAdmin);
router.post('/add', profilePictureUpload.single("profilePicture"),createSuperAdmin);
router.put('/update/:id', profilePictureUpload.single("profilePicture"),updateSuperAdmin);
router.put('/update/admin/:id', profilePictureUpload.single("profilePicture"),updateAdmin);
router.post('/add/Admin', profilePictureUpload.single("profilePicture"),createAdmin);
router.get('/getAll/admin', getAllAdmin);

module.exports = router;
