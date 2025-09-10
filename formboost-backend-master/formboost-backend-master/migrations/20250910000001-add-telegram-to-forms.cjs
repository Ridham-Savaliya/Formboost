'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Forms');

    if (!table.telegramNotification) {
      await queryInterface.addColumn('Forms', 'telegramNotification', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    }

    if (!table.telegramChatId) {
      await queryInterface.addColumn('Forms', 'telegramChatId', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.telegramBotToken) {
      await queryInterface.addColumn('Forms', 'telegramBotToken', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Forms');
    if (table.telegramNotification) {
      await queryInterface.removeColumn('Forms', 'telegramNotification');
    }
    if (table.telegramChatId) {
      await queryInterface.removeColumn('Forms', 'telegramChatId');
    }
    if (table.telegramBotToken) {
      await queryInterface.removeColumn('Forms', 'telegramBotToken');
    }
  },
};