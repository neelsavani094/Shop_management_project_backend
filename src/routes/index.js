const router = require("express").Router();

// Routes

const userRoutes = require('../routes/user_routes');

router.use('/auth',userRoutes);

module.exports = router;