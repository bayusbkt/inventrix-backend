import { DataTypes } from "sequelize";
import { sequelize } from "../Config/Database.js";

const ItemModel = sequelize.define("Item", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 1
    },
  },
  outQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  inQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
});

export default ItemModel;
