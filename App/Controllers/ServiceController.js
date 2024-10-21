import { generateExcel } from "../Services/ExcelService.js";
import TransactionModel from "../Models/TransactionModel.js";
import ItemModel from "../Models/ItemModel.js";
import UserModel from "../Models/UserModel.js";
import UnitModel from "../Models/ItemUnitModel.js";

class ServiceController {
  async TransactionHistoryExcel(req, res) {
    try {
      const transactionData = await TransactionModel.findAll({
        include: [
          {
            model: ItemModel,
            as: "item",
            attributes: ['itemName'],
          },
          {
            model: UnitModel,
            as: "unit",
            attributes: ['id'],
          },
          {
            model: UserModel,
            as: "user",
            attributes: ['name'],
          }
        ]
      });

      const transformedData = transactionData.map(transaction => {
        const plainTransaction = transaction.get({ plain: true });
        return {
          'ID Transaksi': plainTransaction.id,
          'Nama Barang': plainTransaction.item?.itemName || '-', 
          'ID Unit': plainTransaction.unit?.id || '-', 
          'Pengguna': plainTransaction.user?.name || '-',
          'Jenis Transaksi': plainTransaction.transactionType,
          'Tanggal Transaksi': new Date(plainTransaction.transactionDate).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          'Tanggal Dibuat': new Date(plainTransaction.createdAt).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          'Tanggal Diupdate': new Date(plainTransaction.updatedAt).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        };
      });
      
      const { buffer, fileName } = await generateExcel(
        transformedData,
        "riwayat_barang.xlsx"
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

      return res.send(buffer);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        status: false,
        message: "Error generating Excel file",
        error: error.message
      });
    }
  }
}

export default new ServiceController();