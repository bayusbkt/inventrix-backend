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
  itemStatus: {
    type: DataTypes.ENUM("Tersedia", "Dipinjam", "Dalam Perbaikan"),
    allowNull: false,
    defaultValue: 'Tersedia',
    validate: {
        isIn: [['Tersedia', 'Dipinjam', 'Dalam Perbaikan']],
      },
  },
  checkoutTime: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
  returnTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  }
});

export default ItemModel;
