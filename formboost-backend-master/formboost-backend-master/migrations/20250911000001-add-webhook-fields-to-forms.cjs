'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('forms', 'webhookUrl', {
      type: Sequelize.STRING(2048),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    });

    await queryInterface.addColumn('forms', 'webhookEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('forms', 'webhookUrl');
    await queryInterface.removeColumn('forms', 'webhookEnabled');
  }
};
