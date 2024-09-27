import ItemModel from "../Models/ItemModel.js";
import UserModel from "../Models/UserModel.js";
import { sequelize } from "../Config/Database.js";

class CheckoutController {
  async checkoutItem(req, res) {
    const t = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      if (!itemId) throw { message: "Item ID is Required" };

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) {
        await t.rollback();
        throw { message: "User Not Found" };
      }

      const item = await ItemModel.findByPk(itemId, { transaction: t });
      if (!item) {
        await t.rollback();
        throw { message: "Item Not Found" };
      }

      if (item.itemStatus !== "Available") {
        await t.rollback();
        throw { message: "Item is Not Available" };
      }

      await item.update(
        {
          itemStatus: "CheckedOut",
          userId: user.userId,
          checkoutTime: new Date(),
          returnTime: null,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "Success Checkout Item",
        data: {
          itemId: item.itemId,
          itemName: item.itemName,
          userId: user.userId,
          userName: user.name,
          checkoutTime: item.checkoutTime,
        },
      });
    } catch (error) {
      await t.rollback();
      console.error("Error during checkout:", error);
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async returnItem(req, res) {
    const t = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      if (!itemId) throw { message: "Item ID is Required" };

      const item = await ItemModel.findByPk(itemId, { transaction: t });
      if (!item) {
        await t.rollback();
        throw { message: "Item Not Found" };
      }

      if (item.itemStatus !== "CheckedOut") {
        await t.rollback();
        throw { message: "Item is Not CheckedOut" };
      }

      await item.update(
        {
          itemStatus: "Available",
          userId: null,
          returnTime: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "Success Return Item",
        data: {
          itemId: item.id,
          itemName: item.name,
          returnTime: item.returnTime,
        },
      });
    } catch (error) {
      await t.rollback();
      console.error("Error during checkout:", error);
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getCheckoutedItem(req, res) {
    try {
      const checkoutItem = await ItemModel.findAll({
        where: {
          itemStatus: "CheckedOut",
        },
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: ["id", "nis", "name"],
          },
        ],
      });

      return res.status(200).json({
        status: true,
        message: "Success Get Checkouted Item",
        data: checkoutItem,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new CheckoutController();
