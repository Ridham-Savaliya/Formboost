import { DataTypes } from 'sequelize';
import sequelize from '#database/config.js';
import User from '#modules/user/model.js';

const Form = sequelize.define('Form', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  alias: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  formName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name',
  },
  formDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filterSpam: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  emailNotification: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  targetEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  telegramNotification: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  telegramChatId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telegramBotToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPrebuilt: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  prebuiltTemplate: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
},  {
  // Important: Tell Sequelize to use the lowercase 'users' table name
  sequelize,
  modelName: 'Forms',
  tableName: 'forms', // Explicitly define the table name as lowercase
  freezeTableName: true, // Prevents Sequelize from trying to pluralize the table name
});

User.hasMany(Form, { foreignKey: 'userId', onDelete: 'CASCADE' });
Form.belongsTo(User, { foreignKey: 'userId' });

export default Form;
