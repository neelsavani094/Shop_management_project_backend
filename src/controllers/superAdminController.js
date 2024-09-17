const { SuperAdmin , Admin } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require("sequelize");

const getAllSuperAdmin = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findAll({ order: [ ['createdAt', 'DESC'] ] });
    res.json({
        success: true,
        message: "Data Fetch Successfully",
        superAdmin: superAdmin,
    });
  } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  }
}

const createSuperAdmin = async (req, res) => {
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password || "", 10);

        // Handle profile picture path
        const profilePicture = req.file?.path
            ? req.file.path.replace(/\\/g, "/").split("public")[1]
            : "";

        // Prepare superAdmin data
        const superAdminData = {
            ...req.body,
            password: hashedPassword,
            profilePicture: profilePicture,
        };

        // Check if email or phone already exists
        const existingSuperAdmin = await SuperAdmin.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: req.body.email },
                    { phone: req.body.phone }
                ]
            }
        });

        if (existingSuperAdmin) {
            if (existingSuperAdmin.email === req.body.email) {
                return res.status(400).json({ message: "Email already in use" });
            }
            if (existingSuperAdmin.phone === req.body.phone) {
                return res.status(400).json({ message: "Phone already in use" });
            }
        }

        // Create new superAdmin
        const superAdmin = await SuperAdmin.create(superAdminData);

        res.status(200).json({ message: "SuperAdmin Registered Successfully", superAdmin });

    } catch (error) {
        console.error("Error registering superAdmin:", error);

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


const loginSuperAdmin = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find the superAdmin by email
        const superAdmin = await SuperAdmin.findOne({
            where: { phone },
        });

        if (!superAdmin) {
            return res.status(404).json({ message: "Invalid phone number" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Send superAdmin data and login message
        res.status(200).json({ message: "SuperAdmin logged in successfully", superAdmin });
    } catch (error) {
        console.error("Error logging in superAdmin:", error);
        res.status(500).json({ message: "Error logging in superAdmin", error: error.message });
    }
};

const updateSuperAdmin = async (req, res) => {
 
    const profilePicture = req.file?.path
    ? req.file.path.replace(/\\/g, "/").split("public")[1]
    : "";
    const hashedPassword = await bcrypt.hash(req.body.password || "", 10);
    try {
        const { id } = req.params;
        
        const superAdminData = {
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
        };

        const superAdmin = await SuperAdmin.findByPk(id);
        if (!superAdmin) {
            return res.status(404).json({ message: "SuperAdmin not found" });
        }

        // Check if email or phone is already used by another superAdmin
        const existingSuperAdmin = await SuperAdmin.findOne({
            where: {
                [Sequelize.Op.and]: {
                    id: { [Sequelize.Op.ne]: id },
                    [Sequelize.Op.or]: [{ email : superAdminData.email }, { phone : superAdminData.phone}],
                },
            },
        });

        if (existingSuperAdmin) {
            return res.status(400).json({
                message: "Email or phone already in use by another superAdmin",
            });
        }

        if (req.file?.path != null) {
            superAdminData.profilePicture = profilePicture;
          }
          
        // Update the superAdmin
    
        // const superAdminData = {
        //     ...req.body,
        //     password: hashedPassword,
        //     profilePicture: profilePicture,
        // };
     await SuperAdmin.update(superAdminData, {
            where: {
              id: id,
            }
          });
          
          const updatedSuperAdmin = await SuperAdmin.findByPk(id);

          // Send the updated superAdmin data in the response
          res.status(200).json(updatedSuperAdmin);
    } catch (error) {
        res.status(500).json({ message: "Error updating superAdmin", error : error.message });
    }
};

const createAdmin = async (req, res) => {
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password || "", 10);

        // Handle profile picture path
        const profilePicture = req.file?.path
            ? req.file.path.replace(/\\/g, "/").split("public")[1]
            : "";

        // Prepare superAdmin data
        const AdminData = {
            ...req.body,
            password: hashedPassword,
            profilePicture: profilePicture,
        };

        // Check if email or phone already exists
        const existingAdmin = await Admin.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: req.body.email },
                    { phone: req.body.phone }
                ]
            }
        });

        if (existingAdmin) {
            if (existingAdmin.email === req.body.email) {
                return res.status(400).json({ message: "Email already in use" });
            }
            if (existingAdmin.phone === req.body.phone) {
                return res.status(400).json({ message: "Phone already in use" });
            }
        }

        // Create new superAdmin
        const admin = await Admin.create(AdminData);

        res.status(200).json({ message: "Admin Registered Successfully", admin });

    } catch (error) {
        console.error("Error registering Admin:", error);

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

const getAllAdmin = async (req, res) => {
    try {
      const admin = await Admin.findAll({ order: [ ['createdAt', 'DESC'] ] });
      res.json({
          success: true,
          message: "Data Fetch Successfully",
          admin: admin,
      });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
  }

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

module.exports = {
  getAllSuperAdmin,
  createSuperAdmin,
  loginSuperAdmin,
  updateSuperAdmin,
  createAdmin,
  updateAdmin,
  getAllAdmin
};