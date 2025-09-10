import { DataTypes, Model } from 'sequelize';
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
}, {
  sequelize,
  modelName: 'FormSubmission',
  tableName: 'formsubmissions', // Explicitly define the table name for FormSubmission
  freezeTableName: true,
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
}, {
  sequelize,
  modelName: 'FormSubmissionData', // Correct model name
  tableName: 'formsubmissiondata', // Explicitly define the table name for FormSubmissionData
  freezeTableName: true,
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
