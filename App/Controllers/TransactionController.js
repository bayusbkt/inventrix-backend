import { sequelize } from "../Config/Database";

class TransactionController {
  async checkoutUnit(req, res) {
    const t = await sequelize.transaction();
    try {
        
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}
