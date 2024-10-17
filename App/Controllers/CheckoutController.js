import ItemModel from "../Models/ItemModel.js";
import UserModel from "../Models/UserModel.js";
import TransactionModel from "../Models/TransactionModel.js";
import { sequelize } from "../Config/Database.js";
import { Op } from "sequelize";

class CheckoutController {
  async checkoutItem(req, res) {
    const t = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      if (!itemId) throw { message: "Item ID dibutuhkan" };

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) {
        throw { message: "Pengguna tidak ditemukan" };
      }

      const item = await ItemModel.findByPk(itemId, { transaction: t });
      if (!item) {
        throw { message: "Item Not Found" };
      }

      if (item.itemStatus !== "Tersedia") {
        throw { message: "Item tidak tersedia" };
      }

      await item.update(
        {
          itemStatus: "Dipinjam",
          userId: user.dataValues.id,
          outQuantity: item.outQuantity + 1,
          inQuantity: item.inQuantity - 1,
          checkoutTime: new Date(),
          returnTime: null,
        },
        { transaction: t }
      );

      await TransactionModel.create(
        {
          itemId: item.id,
          userId: user.dataValues.id,
          transactionType: "Peminjaman",
          transactionDate: new Date(),
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
          userId: user.dataValues.id,
          userName: user.name,
          checkoutTime: item.checkoutTime,
        },
      });
    } catch (error) {
      await t.rollback();
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

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) {
        throw { message: "Pengguna tidak ditemukan" };
      }

      const item = await ItemModel.findByPk(itemId, { transaction: t });
      if (!item) {
        throw { message: "Item tidak ditemukan" };
      }

      if (item.itemStatus !== "Dipinjam") {
        throw { message: "Item tidak sedang dipinjam" };
      }

      await item.update(
        {
          itemStatus: "Tersedia",
          outQuantity: item.outQuantity - 1,
          inQuantity: item.inQuantity + 1,
          userId: null,
          returnTime: new Date(),
        },
        { transaction: t }
      );

      await TransactionModel.create(
        {
          itemId: item.id,
          userId: user.dataValues.id,
          transactionType: "Pengembalian",
          transactionDate: new Date(),
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
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async checkoutedItem(req, res) {
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
