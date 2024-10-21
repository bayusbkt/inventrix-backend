'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Units', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('Tersedia', 'Dipinjam', 'Dalam Perbaikan', 'Rusak'),
        allowNull: false,
        defaultValue: 'Tersedia'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      outTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      inTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Units');
  }
};