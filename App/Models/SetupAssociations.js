import UserModel from './UserModel.js';
import ItemModel from './ItemModel.js';

const setupAssociations = () => {
  UserModel.hasMany(ItemModel, {
    foreignKey: "userId",
    as: "items",
  });

  ItemModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "user",
  });
};

export default setupAssociations;