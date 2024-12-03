import ItemModel from "../Models/ItemModel.js";
import ItemUnitModel from "../Models/ItemUnitModel.js";

class ItemUnitController {
  async getUnit(req, res) {
    try {
      const { id } = req.params;

      if (id) {
        const unit = await ItemUnitModel.findByPk(id);
        if (!unit) throw { message: "Unit tidak ditemukan" };

        return res.status(200).json({
          status: true,
          message: "Sukses melihat unit berdasarkan ID",
          data: unit,
        });
      } else {
        const unit = await ItemUnitModel.findAll();
        if (!unit) throw { message: "Unit tidak ditemukan" };

        return res.status(200).json({
          status: true,
          message: "Sukses melihat semua unit",
          data: unit,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getUnitByItemId(req, res) {
    try {
      const { itemId } = req.params;
      if (!itemId) throw { message: "Item ID tidak valid" };

      const item = await ItemModel.findByPk(itemId);
      if (!item) throw { message: "Item tidak ditemukan" };

      const units = await ItemUnitModel.findAll({
        where: { item_id: itemId },
      });

      if (units.length === 0) {
        return res.status(200).json({
          status: true,
          message: "Tidak ada unit untuk item ini",
          data: [],
        });
      }

      const summary = {
        total: units.length,
        tersedia: units.filter((unit) => unit.status === "Tersedia").length,
        dipinjam: units.filter((unit) => unit.status === "Dipinjam").length,
        dalamPerbaikan: units.filter(
          (unit) => unit.status === "Dalam Perbaikan"
        ).length,
        rusak: units.filter((unit) => unit.status === "Rusak").length,
      };

      return res.status(200).json({
        status: true,
        message: "Sukses mendapatkan daftar unit",
        data: {
          item: {
            id: item.id,
            name: item.itemName,
            description: item.description,
          },
          summary,
          units,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  async createUnit(req, res) {
    try {
      const { itemId } = req.params;
      if (!itemId) throw { message: "ID Invalid" };

      const item = await ItemModel.findByPk(itemId);
      if (!item) throw { message: "Item tidak ditemukan" };

      const newUnit = await ItemUnitModel.create({
        item_id: item.id,
        user_id: null,
        status: "Tersedia",
        description: null,
        outTime: null,
        inTime: null,
      });

      await item.update({
        quantity: item.quantity + 1,
        inQuantity: item.inQuantity + 1,
      });

      return res.status(201).json({
        status: true,
        message: "Berhasil menambah unit",
        data: newUnit,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateUnit(req, res) {
    try {
      const { id } = req.params;
      const { status, description } = req.body;

      if (!id) throw { message: "ID Invalid" };
      if (
        !["Tersedia", "Dipinjam", "Dalam Perbaikan", "Rusak"].includes(status)
      )
        throw { message: "Status tidak valid" };

      const unit = await ItemUnitModel.findByPk(id);
      if (!unit) throw { message: "Unit tidak ditemukan" };

      unit.status = status;
      unit.description = description;
      await unit.save();

      return res.status(200).json({
        status: true,
        message: "Berhasil update unit",
        data: unit,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async deleteUnit(req, res) {
    try {
      const { id } = req.params;
      if (!id) throw { message: "ID Invalid" };

      const unit = await ItemUnitModel.findByPk(id);
      if (!unit) throw { message: "Unit tidak ditemukan" };

      if (unit.status !== "Tersedia") {
        throw { message: "Unit sedang dipinjam atau tidak tersedia" };
      }

      const item = await ItemModel.findByPk(unit.item_id);
      if (!item) throw { message: "Item tidak ditemukan" };

      await unit.destroy();

      await item.update({
        quantity: item.quantity - 1,
        inQuantity: item.inQuantity - 1,
      });

      return res.status(200).json({
        status: true,
        message: "Sukses menghapus unit",
      });
    } catch (error) {
      res.status(error.status || 400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new ItemUnitController();
