import { DataTypes } from 'sequelize';
import sequelize from '#database/config.js';
import User from '#modules/user/model.js';
import Plan from '#modules/plan/model.js';

const UserPlan = sequelize.define('UserPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

User.hasMany(UserPlan, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserPlan.belongsTo(User, { foreignKey: 'userId' });
Plan.hasMany(UserPlan, { foreignKey: 'planId', onDelete: 'CASCADE' });
UserPlan.belongsTo(Plan, { foreignKey: 'planId' });

export default UserPlan;
