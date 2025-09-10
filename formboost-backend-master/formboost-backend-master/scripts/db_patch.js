/* eslint-disable no-console */
import sequelize from '../src/database/config.js';

async function ensureColumn(queryInterface, table, column, spec, alterIfDifferent = false) {
  try {
    const desc = await queryInterface.describeTable(table);
    if (!desc[column]) {
      console.log(`[DB] Adding column ${column} to ${table} ...`);
      await queryInterface.addColumn(table, column, spec);
      console.log(`[DB] Added column ${column} to ${table}`);
    } else {
      console.log(`[DB] Column ${column} already exists on ${table}`);
      if (alterIfDifferent) {
        const current = desc[column];
        const currentType = (current.type || '').toUpperCase();
        const desiredType = (spec.type && spec.type.toString ? spec.type.toString() : String(spec.type)).toUpperCase();
        if (desiredType && !currentType.includes(desiredType)) {
          console.log(`[DB] Altering column ${column} on ${table} from ${currentType} to ${desiredType} ...`);
          await queryInterface.changeColumn(table, column, spec);
          console.log(`[DB] Altered column ${column} on ${table}`);
        }
      }
    }
  } catch (err) {
    console.error(`[DB] Failed to ensure column ${column} on ${table}:`, err.message);
    throw err;
  }
}

async function ensureTable(queryInterface, table, spec) {
  try {
    // describeTable throws if table doesn't exist, which is our cue to create it
    await queryInterface.describeTable(table);
    console.log(`[DB] Table ${table} already exists`);
  } catch (err) {
    // If the error indicates the table doesn't exist, create it.
    // Different DBs return different error messages for this.
    if (err && /exist|Unknown table|No description found/i.test(err.message)) {

      console.log(`[DB] Table ${table} does not exist. Creating...`);
      try {
        await queryInterface.createTable(table, spec);
        console.log(`[DB] Created table ${table}`);
      } catch (createErr) {
        console.error(`[DB] Failed to create table ${table}:`, createErr.message);
        throw createErr;
      }
    } else {
      // Re-throw other errors (e.g., connection issues)
      console.error(`[DB] Failed to check table ${table}:`, err.message);
      throw err;
    }
  }
}

async function run() {
  const qi = sequelize.getQueryInterface();
  const { Sequelize } = sequelize;

  // Ensure Forms table has required columns (using correct case from your DB)
  await ensureColumn(qi, 'forms', 'formDescription', { type: Sequelize.STRING, allowNull: true });
  await ensureColumn(qi, 'forms', 'emailNotification', { type: Sequelize.TINYINT(1), allowNull: false, defaultValue: 1 });
  await ensureColumn(qi, 'forms', 'targetEmail', { type: Sequelize.STRING, allowNull: true });
  // Telegram-related columns
  await ensureColumn(qi, 'forms', 'telegramNotification', { type: Sequelize.TINYINT(1), allowNull: false, defaultValue: 0 });
  await ensureColumn(qi, 'forms', 'telegramChatId', { type: Sequelize.STRING, allowNull: true });
  await ensureColumn(qi, 'forms', 'telegramBotToken', { type: Sequelize.STRING, allowNull: true });
  // Template persistence columns (lowercase variants)
  await ensureColumn(qi, 'forms', 'isPrebuilt', { type: Sequelize.TINYINT(1), allowNull: false, defaultValue: 0 });
  // Ensure prebuiltTemplate exists and is TEXT (alter if necessary)
  await ensureColumn(qi, 'forms', 'prebuiltTemplate', { type: Sequelize.TEXT('long'), allowNull: true }, true);

  // Also ensure on capitalized table names for environments with case-sensitive table names
  await ensureColumn(qi, 'Forms', 'isPrebuilt', { type: Sequelize.TINYINT(1), allowNull: false, defaultValue: 0 });
  await ensureColumn(qi, 'Forms', 'prebuiltTemplate', { type: Sequelize.TEXT('long'), allowNull: true }, true);

  // Ensure FormSubmissions table (lowercase to match your DB's case sensitivity)
  await ensureTable(qi, 'formsubmissions', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    formId: { type: Sequelize.UUID, allowNull: false, references: { model: 'forms', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    ip: { type: Sequelize.STRING, allowNull: false },
    submittedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    isSpam: { type: Sequelize.TINYINT(1), allowNull: false, defaultValue: 0 },
    spamScore: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    spamReason: { type: Sequelize.STRING, allowNull: true },
    createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  // Ensure FormSubmissionData table (lowercase to match your DB's case sensitivity)
  await ensureTable(qi, 'formsubmissiondata', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    responseId: { type: Sequelize.UUID, allowNull: false, references: { model: 'formsubmissions', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    key: { type: Sequelize.STRING, allowNull: false },
    value: { type: Sequelize.STRING, allowNull: false },
    createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  console.log('[DB] Patch completed successfully');
}

run()
  .then(() => sequelize.close())
  .catch((err) => {
    console.error('[DB] Patch failed:', err);
    sequelize.close();
    process.exit(1);
  });
