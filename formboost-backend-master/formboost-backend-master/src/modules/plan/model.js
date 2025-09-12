import { DataTypes } from 'sequelize';
import sequelize from '#database/config.js';

const Plan = sequelize.define(
  'Plan',
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
    formLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    submissionLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    // Important: Tell Sequelize to use the lowercase 'users' table name
    sequelize,
    modelName: 'Plan',
    tableName: 'plans', // Explicitly define the table name as lowercase
    freezeTableName: true, // Prevents Sequelize from trying to pluralize the table name
  }
);

export default Plan;
