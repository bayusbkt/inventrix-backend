import UserModel from "./UserModel.js";
import ItemModel from "./ItemModel.js";
import TransactionModel from "./TransactionModel.js";
import ItemUnitModel from "./ItemUnitModel.js";

const setupAssociations = () => {
  UserModel.hasMany(ItemUnitModel, {
    foreignKey: "user_id",
    as: "items",
  });

  UserModel.hasMany(TransactionModel, {
    foreignKey: "user_id",
    as: "transactions",
  });

  ItemModel.hasMany(TransactionModel, {
    foreignKey: "item_id",
    as: "transactions",
  });

  ItemModel.hasMany(ItemUnitModel, { 
    foreignKey: "item_id",
    as: "units" 
  })

  TransactionModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user",
  });

  TransactionModel.belongsTo(ItemUnitModel, {
    foreignKey: "unit_id",
    as: "unit",
  });

  ItemUnitModel.belongsTo(ItemModel, { 
    foreignKey: "item_id", 
    as: "item" 
  });

  ;
};

export default setupAssociations;
