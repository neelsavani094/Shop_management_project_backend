const router = require("express").Router();

// Routes

const userRoutes = require('../routes/user_routes');
const superAdminRoutes = require('../routes/superAdmin_routes');
const adminRoutes = require('../routes/admin_routes');

router.use('/user',userRoutes);
router.use('/superAdmin',superAdminRoutes);
router.use('/admin',adminRoutes);

module.exports = router;