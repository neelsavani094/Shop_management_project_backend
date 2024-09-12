module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
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
            Created_by: {
               type: DataTypes.INTEGER,
               allowNull: true,
            },
            role: {
                type: DataTypes.ENUM(
                    "Customer",    
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
            modelName: 'User',
            tableName: 'Users',
        },
    );
    return User;
  };