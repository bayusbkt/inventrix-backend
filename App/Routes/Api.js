import express from "express";
import AuthUser from "../Middlewares/AuthUser.js";
import AuthControllers from "../Controllers/AuthController.js";
import UserController from "../Controllers/UserController.js";
import ItemController from "../Controllers/ItemController.js";
import ItemUnitController from "../Controllers/ItemUnitController.js";
import TransactionController from "../Controllers/TransactionController.js";
import ServiceController from "../Controllers/ServiceController.js";

const router = express.Router();

//Auth
router.post("/login", AuthControllers.login);
router.delete("/logout", AuthControllers.logout);

//User
router.post(
  "/user/create",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  UserController.createUser
); //Admin Only
router.post(
  "/user/change-password",
  AuthUser.verifyUser,
  UserController.changePassword
);

//Item
router.post(
  "/item/create",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  ItemController.createItem
); //Admin Only
router.put(
  "/item/update/:id",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  ItemController.updateItem
); //Admin Only
router.delete(
  "/item/delete/:id",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  ItemController.deleteItem
); //Admin Only
router.get("/item/:id?", AuthUser.verifyUser, ItemController.getItem);

//Unit
router.post(
  "/unit/create/:itemId",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  ItemUnitController.createUnit
); //Admin Only
router.put(
  "/unit/update/:id",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  ItemUnitController.updateUnit
); //Admin Only
router.delete(
  "/unit/delete/:id",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  ItemUnitController.deleteUnit
); //Admin Only
router.get("/unit/:id?", AuthUser.verifyUser, ItemUnitController.getUnit);
router.get(
  "/unit-by-itemid/:itemId",
  AuthUser.verifyUser,
  ItemUnitController.getUnitByItemId
);

//Transaction (Pinjam)
router.post(
  "/transaction/checkout/:unitId",
  AuthUser.verifyUser,
  TransactionController.checkoutUnit
);
router.post(
  "/transaction/return/:unitId",
  AuthUser.verifyUser,
  TransactionController.returnUnit
);
router.post(
  "/transaction/repair/:unitId",
  AuthUser.verifyUser,
  TransactionController.repairUnit
);
router.post(
  "/transaction/broken/:unitId",
  AuthUser.verifyUser,
  TransactionController.brokenUnit
);
router.post(
  "/transaction/accept-checkout/:transactionId",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  TransactionController.acceptCheckout
); //Admin Only
router.post(
  "/transaction/reject-checkout/:transactionId",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  TransactionController.rejectCheckout
); //Admin Only
router.get(
  "/transaction/checkout",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  TransactionController.getAllTransaction
); //Admin Only
router.get(
  "/transaction/checkout-peminjaman",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  TransactionController.getPeminjaman
); //Admin Only
router.get(
  "/transaction/checkout-menunggu-konfirmasi",
  AuthUser.verifyUser,
  AuthUser.adminOnly,
  TransactionController.getMenungguKonfirmasi
);
router.get(
  `/transaction/user-peminjaman/:userId`,
  AuthUser.verifyUser,
  TransactionController.getUserPeminjaman
);

//Export to Excel
router.get(
  "/export/transaction-history",
  AuthUser.verifyUser,
  ServiceController.TransactionHistoryExcel
);

export default router;
