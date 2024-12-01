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

      const checkoutData = await TransactionModel.create(
        {
          item_id: unit.item_id,
          unit_id: unit.id,
          user_id: user.id,
          transactionType: "Peminjaman",
          transactionDate: now,
          // status: "Menunggu Konfirmasi", ini harusnya bikinin modelnya sendiri gak sih?
        },
        { transaction: t }
      );

      await t.commit(); // Menyimpan transaksi ke database
      return res.status(200).json({
        status: true,
        message: "Checkout berhasil. Silahkan menunggu konfirmasi dari admin",
        data: checkoutData,
      });
    } catch (error) {
      await t.rollback(); // Rollback untuk menangani error
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

      const unit = await TransactionModel.findByPk(transactionId, {
        transaction: t,
      });
      if (!unit) throw { message: "Unit tidak ditemukan" };
      if (unit.status !== "Tersedia")
        throw { message: "Unit tidak tersedia untuk dipinjam" };

      const item = await TransactionModel.findByPk(unit.item_id, {
        transaction: t,
      });
      if (!item) throw { message: "Item tidak ditemukan" };

      // const transaction = await TransactionModel.findByPk(TransactionModel.id, {
      //   transaction: t,
      // });
      // if (!transaction) throw { message: "Transaksi tidak ditemukan" };

      const checkoutData = await TransactionModel.findOne({
        where: {
          id: TransactionModel.id,
        },
      });

      if (!checkoutData)
        throw { message: "Data checkout unit tidak ditemukan" };

      const { status } = req.body;
      if (status === "Dikonfirmasi") {
        await unit.update(
          {
            user_id: user.id,
            status: "Dipinjam",
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

        await t.commit(); // Menyimpan transaksi ke database
        return res.status(200).json({
          status: true,
          message: "Checkout berhasil dikonfirmasi",
          data: checkoutData,
        });
      } else {
        await t.rollback(); // Membatalkan transaksi
        return res.status(400).json({
          status: false,
          message: "Checkout tidak dikonfirmasi",
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new TransactionController();
