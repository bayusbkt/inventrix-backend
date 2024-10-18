import { DataTypes } from "sequelize";
import { sequelize } from "../Config/Database.js";

const TransactionModel = sequelize.define("Transaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  unit_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Units',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  transactionType: {
    type: DataTypes.ENUM('Peminjaman', 'Pengembalian', 'Perbaikan'),
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default TransactionModel;
