module.exports = (sequelize, DataTypes) => {
    const SuperAdmin = sequelize.define(
        "SuperAdmin",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            phone: {
                type: DataTypes.BIGINT,
                allowNull: false,
                validate: {
                    isNumeric: true,
                    len: [10, 15],
                },
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profilePicture: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM(
                    "SuperAdmin",  
                ),
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            timestamps: true,
            indexes: [
                { unique: true, fields: ["email"] },
                { unique: true, fields: ["phone"] },
            ],
            sequelize,
            modelName: 'SuperAdmin',
            tableName: 'SuperAdmins',
        },
    );
    return SuperAdmin;
  };