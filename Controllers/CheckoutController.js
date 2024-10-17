import ItemModel from "../Models/ItemModel.js";
import UserModel from "../Models/UserModel.js";
import { sequelize } from "../Config/Database.js";

class CheckoutController {
  async checkoutItem(req, res) {
    const t = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      if (!itemId) throw { message: "Item ID dibutuhkan" };

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) {
        await t.rollback();
        throw { message: "Pengguna tidak ditemukan" };
      }

      const item = await ItemModel.findByPk(itemId, { transaction: t });
      if (!item) {
        await t.rollback();
        throw { message: "Item Not Found" };
      }

      if (item.itemStatus !== "Tersedia") {
        await t.rollback();
        throw { message: "Item tidak tersedia" };
      }

      await item.update(
        {
          itemStatus: req.body.itemStatus,
          userId: user.userId,
          checkoutTime: new Date(),
          returnTime: null,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "Sukses meminjam item",
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
      console.error("Error saat meminjam item:", error);
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
      if (!itemId) throw { message: "Item ID dibutuhkan" };

      const item = await ItemModel.findByPk(itemId, { transaction: t });
      if (!item) {
        await t.rollback();
        throw { message: "Item tidak ditemukan" };
      }

      if (item.itemStatus !== "Dipinjam") {
        await t.rollback();
        throw { message: "Item tidak sedang dipinjam" };
      }

      await item.update(
        {
          itemStatus: req.body.itemStatus,
          userId: null,
          returnTime: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "Sukses mengembalikan item",
        data: {
          itemId: item.id,
          itemName: item.name,
          returnTime: item.returnTime,
        },
      });
    } catch (error) {
      await t.rollback();
      console.error("Error saat mengembalikan item:", error);
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
          itemStatus: "Dipinjam",
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
        message: "Sukses melihat item yang dipinjam",
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
