const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require("sequelize");

const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find the user by email
        const user = await User.findOne({
            where: { phone },
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid phone number" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Send user data and login message
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};

const updateUser = async (req, res) => {
 
    const profilePicture = req.file?.path
    ? req.file.path.replace(/\\/g, "/").split("public")[1]
    : "";
    const hashedPassword = await bcrypt.hash(req.body.password || "", 10);
    try {
        const { id } = req.params;
        
        const userData = {
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
        };

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email or phone is already used by another user
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.and]: {
                    id: { [Sequelize.Op.ne]: id },
                    [Sequelize.Op.or]: [{ email : userData.email }, { phone : userData.phone}],
                },
            },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or phone already in use by another user",
            });
        }

        if (req.file?.path != null) {
            userData.profilePicture = profilePicture;
          }
          
        // Update the user
    
        // const userData = {
        //     ...req.body,
        //     password: hashedPassword,
        //     profilePicture: profilePicture,
        // };
     await User.update(userData, {
            where: {
              id: id,
            }
          });
          
          const updatedUser = await User.findByPk(id);

          // Send the updated user data in the response
          res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error : error.message });
    }
};

module.exports = {
    loginUser,
    updateUser
  };