import { DataTypes } from "sequelize";
import { sequelize } from "../Config/Database.js";
import ItemUnitModel from "./ItemUnitModel.js";
import UserModel from "./UserModel.js";
import ItemModel from "./ItemModel.js";

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
  item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ItemModel,
      key: "id",
    },
  },
  unit_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ItemUnitModel,
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: "id",
    },
  },
  transactionType: {
    type: DataTypes.ENUM("Peminjaman", "Pengembalian", "Perbaikan", "Lainnya"),
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default TransactionModel;
