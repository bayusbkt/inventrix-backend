import { DataTypes } from "sequelize";
import { sequelize } from "../Config/Database.js";
import ItemModel from "./ItemModel.js";
import UserModel from "./UserModel.js";

const ItemUnitModel = sequelize.define("Unit", {
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
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: UserModel,
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("Tersedia", "Dipinjam", "Menunggu Konfirmasi", "Dalam Perbaikan", "Rusak"),
    allowNull: false,
    defaultValue: "Tersedia",
    validate: {
      isIn: [["Tersedia", "Dipinjam", "Menunggu Konfirmasi", "Dalam Perbaikan", "Rusak"]],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  outTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  inTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default ItemUnitModel;
