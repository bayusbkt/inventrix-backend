'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
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
        }
      },
      unit_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Units',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      transactionType: {
        type: Sequelize.ENUM('Peminjaman', 'Pengembalian', 'Perbaikan', 'Lainnya'),
        allowNull: false
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('Transactions');
  }
};