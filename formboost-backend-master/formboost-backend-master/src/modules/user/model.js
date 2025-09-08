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
  firebase_UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
