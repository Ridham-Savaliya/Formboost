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
});

User.hasMany(Form, { foreignKey: 'userId', onDelete: 'CASCADE' });
Form.belongsTo(User, { foreignKey: 'userId' });

export default Form;
