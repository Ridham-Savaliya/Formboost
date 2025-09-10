import { DataTypes } from 'sequelize';
import sequelize from '#database/config.js';
// import bcrypt from 'bcrypt'; // Temporarily disabled due to native binding issues

const Admin = sequelize.define(
  'Admin',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        // Temporarily disabled bcrypt hashing - use plain text for development
        console.warn('Password hashing disabled - using plain text (development only)');
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          // Temporarily disabled bcrypt hashing - use plain text for development
          console.warn('Password hashing disabled - using plain text (development only)');
          // const salt = await bcrypt.genSalt(10);
          // user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }, {
  // Important: Tell Sequelize to use the lowercase 'users' table name
  sequelize,
  modelName: 'Admins',
  tableName: 'admins', // Explicitly define the table name as lowercase
  freezeTableName: true, // Prevents Sequelize from trying to pluralize the table name
}
);

Admin.prototype.validPassword = async function (password) {
  // Temporarily disabled bcrypt comparison - use plain text for development
  console.warn('Password comparison disabled - using plain text (development only)');
  return password === this.password;
  // return await bcrypt.compare(password, this.password);
};

export default Admin;
