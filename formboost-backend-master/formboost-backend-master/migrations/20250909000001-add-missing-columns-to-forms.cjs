'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Forms');

    if (!table.formDescription) {
      await queryInterface.addColumn('Forms', 'formDescription', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.emailNotification) {
      await queryInterface.addColumn('Forms', 'emailNotification', {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      });
    }

    if (!table.targetEmail) {
      await queryInterface.addColumn('Forms', 'targetEmail', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // If your code expects 'formName', map it to existing 'name' column by adding a separate column.
    // Prefer not to duplicate; instead, we keep the DB schema lean and map in the model via `field: 'name'`.
    // If you explicitly require a physical 'formName' column, you could guard and add similarly here.
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Forms');
    if (table.formDescription) {
      await queryInterface.removeColumn('Forms', 'formDescription');
    }
    if (table.emailNotification) {
      await queryInterface.removeColumn('Forms', 'emailNotification');
    }
    if (table.targetEmail) {
      await queryInterface.removeColumn('Forms', 'targetEmail');
    }
  }
};
