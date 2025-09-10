import { DataTypes } from 'sequelize';
import sequelize from '#database/config.js';
import UserPlan from '#modules/user-plan/model.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions',
  freezeTableName: true,
});

UserPlan.hasMany(Transaction, { foreignKey: 'userPlanId' });
Transaction.belongsTo(UserPlan, { foreignKey: 'userPlanId' });

export default Transaction;
