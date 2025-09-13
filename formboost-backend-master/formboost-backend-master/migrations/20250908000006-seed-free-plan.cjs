'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Plans', [
      {
        name: 'Free Plan',
        description: 'Basic free plan with limited features',
        price: 0.00,
        formLimit: -1,
        submissionLimit: -1,
        isFree: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Plans', {
      isFree: true
    });
  }
};
