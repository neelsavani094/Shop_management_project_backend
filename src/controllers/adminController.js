const { Admin , User } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require("sequelize");

const loginAdmin = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find the admin by email
        const admin = await Admin.findOne({
            where: { phone },
        });

        if (!admin) {
            return res.status(404).json({ message: "Invalid phone number" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Send admin data and login message
        res.status(200).json({ message: "Admin logged in successfully", admin });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Error logging in admin", error: error.message });
    }
};

const updateAdmin = async (req, res) => {
 
    const profilePicture = req.file?.path
    ? req.file.path.replace(/\\/g, "/").split("public")[1]
    : "";
    const hashedPassword = await bcrypt.hash(req.body.password || "", 10);
    try {
        const { id } = req.params;
        
        const adminData = {
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
        };

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check if email or phone is already used by another admin
        const existingAdmin = await Admin.findOne({
            where: {
                [Sequelize.Op.and]: {
                    id: { [Sequelize.Op.ne]: id },
                    [Sequelize.Op.or]: [{ email : adminData.email }, { phone : adminData.phone}],
                },
            },
        });

        if (existingAdmin) {
            return res.status(400).json({
                message: "Email or phone already in use by another admin",
            });
        }

        if (req.file?.path != null) {
            adminData.profilePicture = profilePicture;
          }
          
        // Update the admin
    
        // const adminData = {
        //     ...req.body,
        //     password: hashedPassword,
        //     profilePicture: profilePicture,
        // };
     await Admin.update(adminData, {
            where: {
              id: id,
            }
          });
          
          const updatedAdmin = await Admin.findByPk(id);

          // Send the updated admin data in the response
          res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: "Error updating admin", error : error.message });
    }
};

const createUser = async (req, res) => {
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password || "", 10);

        // Handle profile picture path
        const profilePicture = req.file?.path
            ? req.file.path.replace(/\\/g, "/").split("public")[1]
            : "";

        // Prepare superAdmin data
        const UserData = {
            ...req.body,
            password: hashedPassword,
            profilePicture: profilePicture,
        };

        // Check if email or phone already exists
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: req.body.email },
                    { phone: req.body.phone }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === req.body.email) {
                return res.status(400).json({ message: "Email already in use" });
            }
            if (existingUser.phone === req.body.phone) {
                return res.status(400).json({ message: "Phone already in use" });
            }
        }

        // Create new superUser
        const user = await User.create(UserData);

        res.status(200).json({ message: "User Registered Successfully", user });

    } catch (error) {
        console.error("Error registering User:", error);

        if (error.name === "SequelizeValidationError") {
            const validationErrors = error.errors.map((err) => ({
                field: err.path,
                message: err.message,
            }));
            res.status(400).json({ errors: validationErrors });
        } else if (error.name === "SequelizeUniqueConstraintError") {
            // Handle unique constraint errors
            res.status(400).json({ message: "Email or phone already in use" });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

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
    loginAdmin,
    updateAdmin,
    createUser,
    updateUser,
    getAllUser
  };