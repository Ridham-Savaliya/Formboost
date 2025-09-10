'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure column exists, then upgrade to LONGTEXT to avoid size issues
    const table = await queryInterface.describeTable('Forms').catch(() => ({}));

    if (table && table.prebuiltTemplate) {
      await queryInterface.changeColumn('Forms', 'prebuiltTemplate', {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      });
    } else {
      // If missing, add directly as LONGTEXT
      await queryInterface.addColumn('Forms', 'prebuiltTemplate', {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert to TEXT to be conservative (still larger than VARCHAR)
    const table = await queryInterface.describeTable('Forms').catch(() => ({}));
    if (table && table.prebuiltTemplate) {
      await queryInterface.changeColumn('Forms', 'prebuiltTemplate', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  }
};


