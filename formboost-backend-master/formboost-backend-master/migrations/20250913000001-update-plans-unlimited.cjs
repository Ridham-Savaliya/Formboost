'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update all existing plans to have unlimited limits
    await queryInterface.bulkUpdate('Plans', 
      {
        formLimit: -1,
        submissionLimit: -1,
        updatedAt: new Date(),
      },
      {} // Update all records
    );
  },

  async down(queryInterface, Sequelize) {
    // Rollback to previous limits if needed
    await queryInterface.bulkUpdate('Plans', 
      {
        formLimit: 5,
        submissionLimit: 100,
        updatedAt: new Date(),
      },
      {
        isFree: true
      }
    );
  }
};
