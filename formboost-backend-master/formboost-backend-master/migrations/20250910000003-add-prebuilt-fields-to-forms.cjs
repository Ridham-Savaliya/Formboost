'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Forms', 'isPrebuilt', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addColumn('Forms', 'prebuiltTemplate', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Forms', 'isPrebuilt');
    await queryInterface.removeColumn('Forms', 'prebuiltTemplate');
  }
};
