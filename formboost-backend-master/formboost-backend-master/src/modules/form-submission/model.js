import { DataTypes } from 'sequelize';
import sequelize from '#database/config.js';
import Form from '#modules/form/model.js';

// --- FormSubmission Model ---
const FormSubmission = sequelize.define('FormSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  isSpam: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  spamScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  spamReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// --- FormSubmissionData Model ---
const FormSubmissionData = sequelize.define('FormSubmissionData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
} ,{
  // Important: Tell Sequelize to use the lowercase 'users' table name
  sequelize,
  modelName: 'FormSubmissions',
  tableName: 'formSubmissions', // Explicitly define the table name as lowercase
  freezeTableName: true, // Prevents Sequelize from trying to pluralize the table name
});

// --- Associations ---
Form.hasMany(FormSubmission, {
  foreignKey: 'formId',
  onDelete: 'CASCADE',
});
FormSubmission.belongsTo(Form, {
  foreignKey: 'formId',
});

FormSubmission.hasMany(FormSubmissionData, {
  foreignKey: 'responseId',
  onDelete: 'CASCADE',
});
FormSubmissionData.belongsTo(FormSubmission, {
  foreignKey: 'responseId',
});

// --- Exports ---
export { FormSubmission, FormSubmissionData };
