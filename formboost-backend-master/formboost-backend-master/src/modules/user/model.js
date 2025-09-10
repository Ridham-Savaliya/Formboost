import { DataTypes } from 'sequelize';
import sequelize from '#database/config.js';

const User = sequelize.define('Users', {
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
  firebaseUid: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'firebaseUid',
  },
},  {
  // Important: Tell Sequelize to use the lowercase 'users' table name
  sequelize,
  modelName: 'Users',
  tableName: 'users', // Explicitly define the table name as lowercase
  freezeTableName: true, // Prevents Sequelize from trying to pluralize the table name
});

export default User;
