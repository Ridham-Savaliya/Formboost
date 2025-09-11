'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('forms', 'slackWebhookUrl', {
      type: Sequelize.STRING(2048),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    });

    await queryInterface.addColumn('forms', 'slackEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('forms', 'googleSheetsId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('forms', 'googleSheetsEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('forms', 'slackWebhookUrl');
    await queryInterface.removeColumn('forms', 'slackEnabled');
    await queryInterface.removeColumn('forms', 'googleSheetsId');
    await queryInterface.removeColumn('forms', 'googleSheetsEnabled');
  }
};
