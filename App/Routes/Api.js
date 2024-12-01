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
router.post("/user/create", AuthUser.verifyUser, AuthUser.adminOnly, UserController.createUser); //Admin Only
router.post("/user/change-password", AuthUser.verifyUser, UserController.changePassword);

//Item
router.post("/item/create", AuthUser.verifyUser, AuthUser.adminOnly, ItemController.createItem); //Admin Only
router.put("/item/update/:id", AuthUser.verifyUser, AuthUser.adminOnly, ItemController.updateItem); //Admin Only
router.delete("/item/delete/:id", AuthUser.verifyUser, AuthUser.adminOnly, ItemController.deleteItem); //Admin Only
router.get("/item/:id?", AuthUser.verifyUser, ItemController.getItem);

//Unit
router.post("/unit/create/:itemId", AuthUser.verifyUser, AuthUser.adminOnly, ItemUnitController.createUnit); //Admin Only
router.put("/unit/update/:id", AuthUser.verifyUser, AuthUser.adminOnly, ItemUnitController.updateUnit); //Admin Only
router.delete("/unit/delete/:id", AuthUser.verifyUser, AuthUser.adminOnly, ItemUnitController.deleteUnit); //Admin Only
router.get("/unit/:itemId", AuthUser.verifyUser, ItemUnitController.getUnitByItemId);
router.get("/unit/:id?", AuthUser.verifyUser, ItemUnitController.getUnit);

//Transaction (Pinjam)
router.post("/transaction/checkout/:unitId", AuthUser.verifyUser, TransactionController.checkoutUnit);
router.post("/transaction/return/:unitId", AuthUser.verifyUser, TransactionController.returnUnit);
router.post("/transaction/repair/:unitId", AuthUser.verifyUser, TransactionController.repairUnit);
router.post("/transaction/broken/:unitId", AuthUser.verifyUser, TransactionController.brokenUnit);

//Export to Excel
router.get("/export/transaction-history", AuthUser.verifyUser, ServiceController.TransactionHistoryExcel);

// router.get("/checkout-history", AuthUser.verifyUser, CheckoutController.checkoutHistory);
// router.get("/return-history", AuthUser.verifyUser, CheckoutController.returnHistory);

export default router;
