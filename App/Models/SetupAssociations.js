import UserModel from './UserModel.js';
import ItemModel from './ItemModel.js';
import TransactionModel from './TransactionModel.js';

const setupAssociations = () => {
  UserModel.hasMany(ItemModel, {
    foreignKey: "userId",
    as: "items",
  });

  ItemModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "user",
  });

  UserModel.hasMany(TransactionModel, {
    foreignKey: "userId",
    as: "transactions",
  });

  ItemModel.hasMany(TransactionModel, {
    foreignKey: "itemId",
    as: "transactions",
  });

  TransactionModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "user",
  });

  TransactionModel.belongsTo(ItemModel, {
    foreignKey: "itemId",
    as: "item",
  });
};

export default setupAssociations;
