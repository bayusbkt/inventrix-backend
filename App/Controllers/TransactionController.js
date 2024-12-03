import { sequelize } from "../Config/Database.js";
import ItemModel from "../Models/ItemModel.js";
import ItemUnitModel from "../Models/ItemUnitModel.js";
import TransactionModel from "../Models/TransactionModel.js";
import UserModel from "../Models/UserModel.js";

class TransactionController {
  async checkoutUnit(req, res) {
    const t = await sequelize.transaction();
    try {
      const { unitId } = req.params;
      if (!unitId) throw { message: "Unit ID dibutuhkan" };

      const unit = await ItemUnitModel.findByPk(unitId, { transaction: t });
      if (!unit) throw { message: "Unit tidak ditemukan" };
      if (unit.status !== "Tersedia")
        throw { message: "Unit tidak tersedia untuk dipinjam" };

      const item = await ItemModel.findByPk(unit.item_id, { transaction: t });
      if (!item) throw { message: "Item tidak ditemukan" };

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) throw { message: "Pengguna tidak ditemukan" };

      const now = new Date();

      await unit.update({
        status: "Menunggu Konfirmasi"
      }, {transaction: t})

      const checkoutData = await TransactionModel.create(
        {
          item_id: unit.item_id,
          unit_id: unit.id,
          user_id: user.id,
          transactionType: "Menunggu Konfirmasi",
          transactionDate: now,
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(200).json({
        status: true,
        message: "Checkout berhasil. Silahkan menunggu konfirmasi dari admin",
        data: checkoutData,
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async returnUnit(req, res) {
    const t = await sequelize.transaction();
    try {
      const { unitId } = req.params;
      if (!unitId) throw { message: "Unit ID dibutuhkan" };

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) throw { message: "Pengguna tidak ditemukan" };

      const unit = await ItemUnitModel.findByPk(unitId, { transaction: t });
      if (!unit) throw { message: "Unit tidak ditemukan" };
      if (unit.status !== "Dipinjam")
        throw { message: "Unit tidak sedang dipinjam" };

      const item = await ItemModel.findByPk(unit.item_id, { transaction: t });
      if (!item) throw { message: "Item tidak ditemukan" };

      const now = new Date();

      await unit.update(
        {
          user_id: user.id,
          status: "Tersedia",
          outTime: null,
          inTime: now,
        },
        { transaction: t }
      );

      await item.update(
        {
          outQuantity: item.outQuantity - 1,
          inQuantity: item.inQuantity + 1,
        },
        { transaction: t }
      );

      const returnData = await TransactionModel.create(
        {
          item_id: unit.item_id,
          unit_id: unit.id,
          user_id: user.id,
          transactionType: "Pengembalian",
          transactionDate: now,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "Berhasil mengembalikan unit",
        data: returnData,
      });
    } catch (error) {
      await t.rollback();
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async repairUnit(req, res) {
    const t = await sequelize.transaction();
    try {
      const { unitId } = req.params;
      if (!unitId) throw { message: "Unit ID dibutuhkan" };

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) throw { message: "Pengguna tidak ditemukan" };

      const unit = await ItemUnitModel.findByPk(unitId, { transaction: t });
      if (!unit) throw { message: "Unit tidak ditemukan" };

      const item = await ItemModel.findByPk(unit.item_id, { transaction: t });
      if (!item) throw { message: "Item tidak ditemukan" };

      const now = new Date();

      await unit.update(
        {
          user_id: user.id,
          status: "Dalam Perbaikan",
          outTime: now,
          inTime: null,
        },
        { transaction: t }
      );

      await item.update(
        {
          outQuantity: item.outQuantity + 1,
          inQuantity: item.inQuantity - 1,
        },
        { transaction: t }
      );

      const repairData = await TransactionModel.create(
        {
          item_id: unit.item_id,
          unit_id: unit.id,
          user_id: user.id,
          transactionType: "Perbaikan",
          transactionDate: now,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "Berhasil mengubah status unit",
        data: repairData,
      });
    } catch (error) {
      await t.rollback();
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async brokenUnit(req, res) {
    const t = await sequelize.transaction();
    try {
      const { unitId } = req.params;
      if (!unitId) throw { message: "Unit ID dibutuhkan" };

      const user = await UserModel.findByPk(req.userId, { transaction: t });
      if (!user) throw { message: "Pengguna tidak ditemukan" };

      const unit = await ItemUnitModel.findByPk(unitId, { transaction: t });
      if (!unit) throw { message: "Unit tidak ditemukan" };

      await unit.update(
        {
          user_id: user.id,
          status: "Rusak",
          outTime: null,
          inTime: null,
        },
        { transaction: t }
      );

      const brokenData = await TransactionModel.create(
        {
          item_id: unit.item_id,
          unit_id: unit.id,
          user_id: user.id,
          transactionType: "Lainnya",
          transactionDate: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "Berhasil mengubah status unit",
        data: brokenData,
      });
    } catch (error) {
      await t.rollback();
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async acceptCheckout(req, res) {
    const t = await sequelize.transaction();

    try {
      const { transactionId } = req.params;
      if (!transactionId) throw { message: "Transaction ID dibutuhkan" };

      const transactionData = await TransactionModel.findByPk(transactionId, {
        include: [
          { model: ItemUnitModel, as: "unit" },
          { model: ItemModel, as: "item" },
          {
            model: UserModel,
            as: "user",
            attributes: {
              exclude: ["password"],
            },
          },
        ],
        transaction: t,
      });
      if (!transactionData) throw { message: "Transaksi tidak ditemukan" };
      if (transactionData.transactionType !== "Menunggu Konfirmasi")
        throw { message: "Transaksi tidak dalam status menunggu konfirmasi" };

      const { status } = req.body;
      const now = new Date();

      if (status == "Dikonfirmasi") {
        //Update Unit
        await transactionData.unit.update(
          {
            status: "Dipinjam",
            user_id: transactionData.user_id,
            outTime: now,
            inTime: null,
          },
          { transaction: t }
        );

        //Update Item
        await transactionData.item.update(
          {
            outQuantity: transactionData.item.outQuantity + 1,
            inQuantity: transactionData.item.inQuantity - 1,
          },
          { transaction: t }
        );

        //Update Transaction
        await transactionData.update(
          {
            transactionType: "Peminjaman",
            transactionDate: now,
          },
          { transaction: t }
        );

        await t.commit();
        return res.status(200).json({
          status: true,
          message: "Checkout berhasil dikonfirmasi",
          data: transactionData,
        });
      } else {
        await transactionData.update(
          {
            transactionType: "Ditolak",
            transactionDate: now,
          },
          { transaction: t }
        );

        await t.commit();
        return res.status(200).json({
          status: true,
          message: "Checkout ditolak",
          data: transactionData,
        });
      }
    } catch (error) {
      await t.rollback();
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async rejectCheckout(req, res) {
    const t = await sequelize.transaction();
  
    try {
      const { transactionId } = req.params;
      if (!transactionId) throw { message: "Transaction ID dibutuhkan" };
  
      const transactionData = await TransactionModel.findByPk(transactionId, {
        include: [
          { model: ItemUnitModel, as: "unit" },
          { model: ItemModel, as: "item" },
          {
            model: UserModel,
            as: "user",
            attributes: {
              exclude: ["password"],
            },
          },
        ],
        transaction: t,
      });
      if (!transactionData) throw { message: "Transaksi tidak ditemukan" };
      if (transactionData.transactionType !== "Menunggu Konfirmasi")
        throw { message: "Transaksi tidak dalam status menunggu konfirmasi" };
  
      const { status } = req.body;
      const now = new Date();
  
      if (status === "Ditolak") {
        await transactionData.unit.update(
          {
            status: "Tersedia",
            user_id: null,
            outTime: null,
            inTime: null,
          },
          { transaction: t }
        );
  
        await transactionData.update(
          {
            transactionType: "Ditolak",
            transactionDate: now,
          },
          { transaction: t }
        );
  
        await t.commit();
        return res.status(200).json({
          status: true,
          message: "Checkout berhasil ditolak",
          data: transactionData,
        });
      } else {
        await t.commit();
        return res.status(200).json({
          status: true,
          message: "Tidak ada perubahan status",
          data: transactionData,
        });
      }
    } catch (error) {
      await t.rollback();
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getAllTransaction(req, res) {
    try {
      const transactionData = await TransactionModel.findAll({
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: {
              exclude: ["password"],
            },
          },
          { model: ItemModel, as: "item", attributes: { exclude: ["id"] } },
          {
            model: ItemUnitModel,
            as: "unit",
            attributes: { exclude: ["id", "item_id", "user_id"] },
          },
        ],

        order: [["createdAt", "ASC"]],
      });

      return res.status(200).json({
        status: "Success",
        data: transactionData,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  }

  async getPeminjaman(req, res) {
    try {
      const dataPeminjaman = await TransactionModel.findAll({
        where: { transactionType: "Peminjaman" },
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: {
              exclude: ["password"],
            },
          },
          { model: ItemModel, as: "item", attributes: { exclude: ["id"] } },
          {
            model: ItemUnitModel,
            where: { status: "Dipinjam" },
            as: "unit",
            attributes: { exclude: ["id", "item_id", "user_id"] },
          },
        ],

        order: [["createdAt", "ASC"]],
      });

      return res.status(200).json({
        status: "Success",
        data: dataPeminjaman,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  }

  async getMenungguKonfirmasi(req, res) {
    try {
      const menungguKonfirmasi = await TransactionModel.findAll({
        where: { transactionType: "Menunggu Konfirmasi" },
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: {
              exclude: ["password"],
            },
          },
          { model: ItemModel, as: "item", attributes: { exclude: ["id"] } },
          {
            model: ItemUnitModel,
            as: "unit",
            attributes: { exclude: ["id", "item_id", "user_id"] },
          },
        ],

        order: [["createdAt", "ASC"]],
      });

      return res.status(200).json({
        status: "Success",
        data: menungguKonfirmasi,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  }

  async getUserPeminjaman(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) throw { message: "User ID tidak ditemukan" };
  
      const userPeminjaman = await TransactionModel.findAll({
        where: { 
          transactionType: "Peminjaman",
          user_id: userId 
        },
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: {
              exclude: ["password"],
            },
          },
          { 
            model: ItemModel,
            as: "item",
            attributes: { exclude: ["id"] } 
          },
          {
            model: ItemUnitModel,
            where: { status: "Dipinjam" },
            as: "unit",
            attributes: { exclude: ["id", "item_id", "user_id"] },
          },
        ],
        order: [["createdAt", "ASC"]],
      });
  
      if (userPeminjaman.length === 0) {
        return res.status(200).json({
          status: true,
          message: "Tidak ada peminjaman yang ditemukan untuk pengguna ini",
          data: []
        });
      }
  
      return res.status(200).json({
        status: "Success",
        data: userPeminjaman,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  }
  
}

export default new TransactionController();
