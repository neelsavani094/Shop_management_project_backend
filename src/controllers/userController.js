const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

const getAllUser = async (req, res) => {
  try {
    const user = await User.findAll({ order: [ ['createdAt', 'DESC'] ] });
    res.json({
        success: true,
        message: "Data Fetch Successfully",
        user: user,
    });
  } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  }
}

const createUser = async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password || "", 10);
        const profilePicture = req.file?.path
            ? req.file.path.replace(/\\/g, "/").split("public")[1]
            : "";

        const userData = {
            ...req.body,
            password: hashedPassword,
            profilePicture: profilePicture,
        };

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email: req.body.email }, { phone: req.body.phone }],
            },
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email or phone already in use" });
        }

        const user = await User.create(userData);

        res.status(200).json({ message: "User Registered Successfully", user });
    } catch (error) {
        console.error("Error registering user:", error);

        if (error.name === "SequelizeValidationError") {
            const validationErrors = error.errors.map((err) => ({
                field: err.path,
                message: err.message,
            }));
            res.status(400).json({ errors: validationErrors });
        } else if (error.name == "Email already exists") {
            error.message = "Email already exists";
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = {
  getAllUser,
  createUser
};