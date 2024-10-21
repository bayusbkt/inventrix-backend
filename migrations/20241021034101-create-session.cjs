module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      sid: {
        type: Sequelize.STRING(36),
        primaryKey: true
      },
      expires: Sequelize.DATE,
      data: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sessions');
  }
};