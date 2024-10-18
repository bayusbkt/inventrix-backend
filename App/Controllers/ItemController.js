import ItemModel from "../Models/ItemModel.js";
import ItemUnitModel from "../Models/ItemUnitModel.js";

class ItemController {
  async getItem(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const item = await ItemModel.findByPk(id, {
          include: {
            model: ItemUnitModel,
            as: "units",
          },
        });
        if (!item) throw { message: "Item tidak ditemukan" };

        return res.status(200).json({
          status: true,
          message: "Sukses melihat item",
          data: item,
        });
      } else {
        const item = await ItemModel.findAll();
        if (!item) throw { message: "Item tidak ditemukan" };

        return res.status(200).json({
          status: true,
          message: "Sukses melihat semua item",
          data: item,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async createItem(req, res) {
    try {
      const { itemName, description, quantity } = req.body;
      if (!itemName) throw { message: "Mohon masukkan nama Item" };
      if (!quantity) throw { message: "Mohon masukkan jumlah Item" };
      if (quantity <= 0) throw { message: "Setidaknya harus memiliki 1 Item" };

      const item = await ItemModel.create({
        itemName,
        description,
        quantity,
        inQuantity: quantity,
        itemStatus: "Tersedia",
      });
      if (!item) throw { message: "Gagal membuat Item" };

      const units = [];
      for (let i = 0; i < quantity; i++) {
        const unit = await ItemUnitModel.create({
          item_id: item.id,
          user_id: null,
          status: "Tersedia",
          outTime: null,
          inTime: null,
        });
        units.push(unit);
      }

      return res.status(201).json({
        status: true,
        message: "Sukses membuat Item",
        data: item,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { itemName, description } = req.body;

      if (!itemName) throw { message: "Mohon masukkan nama Item" };
      if (!description) throw { message: "Mohon masukkan deskripsi Item" };

      const item = await ItemModel.findByPk(id);

      if (!item) {
        return res.status(404).json({
          status: false,
          message: "Item tidak ditemukan",
        });
      }

      item.itemName = itemName;
      item.description = description;
      await item.save();

      return res.status(200).json({
        status: true,
        message: "Berhasil Update Item",
        data: item,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async deleteItem(req, res) {
    try {
      const { id } = req.params;

      const item = await ItemModel.destroy({ where: { id } });
      if (!item) throw { message: "Item tidak ditemukan" };

      return res.status(200).json({
        status: true,
        message: "Sukses menghapus Item",
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  
}

export default new ItemController();
