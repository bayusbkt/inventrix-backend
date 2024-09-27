import ItemModel from "../Models/ItemModel.js";

class ItemController {
  async getItem(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const item = await ItemModel.findByPk(id);
        if (!item) throw { message: "Item Not Found" };

        return res.status(200).json({
          status: true,
          message: "Success Get Item",
          data: item,
        });
      } else {
        const item = await ItemModel.findAll();
        if (!item) throw { message: "Item Not Found" };

        return res.status(200).json({
          status: true,
          message: "Success Get All Item",
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
      if (!itemName) throw { message: "Please Input Item Name" };
      if (!quantity) throw { message: "Please Input Quantity" };
      if (quantity <= 0)
        throw { message: "Item Must Have at Least 1 Quantity" };

      const item = await ItemModel.create({
        itemName,
        description,
        quantity,
        itemStatus: "Available",
      });
      if (!item) throw { message: "Failed to Create Item" };

      return res.status(201).json({
        status: true,
        message: "Success Create Item",
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
      const { itemName, description, quantity, itemStatus } = req.body;

      if (!itemName) throw { message: "Please Input Item Name" };
      if (!quantity) throw { message: "Please Input Quantity" };
      if (quantity <= 0)
        throw { message: "Item Must Have at Least 1 Quantity" };

      const item = await ItemModel.findByPk(id);
      if (!item) throw { message: "Item Not Found" };

      if (itemName) {
        item.itemName = itemName;
      }

      if (description) {
        item.description = description;
      }

      if (quantity) {
        if (quantity <= 0)
          throw { message: "Item Must Have at Least 1 Quantity" };

        item.quantity = quantity;
      }

      if (itemStatus) {
        if (!["Available", "CheckedOut", "Maintenance"].includes(itemStatus)) {
          throw { message: "Invalid Item Status" };
        }

        item.itemStatus = itemStatus;
      }

      await item.save();

      return res.status(200).json({
        status: true,
        message: "Success Update Item",
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
      if (!item) throw { message: "Item Not Found" };

      return res.status(200).json({
        status: true,
        message: "Success Delete Item",
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
