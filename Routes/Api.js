import express from "express";
import AuthUser from "../Middlewares/AuthUser.js";
import AuthControllers from "../Controllers/AuthController.js";
import UserController from "../Controllers/UserController.js";
import ItemController from "../Controllers/ItemController.js";
import CheckoutController from "../Controllers/CheckoutController.js";

const router = express.Router();

//Auth
router.post("/login", AuthControllers.login);
router.delete("/logout", AuthControllers.logout);

//User
router.post("/create-user", AuthUser.verifyUser, AuthUser.adminOnly, UserController.createUser); //Admin Only
router.post("/change-password", AuthUser.verifyUser, UserController.changePassword);

//Item
router.post("/create-item", AuthUser.verifyUser, AuthUser.adminOnly, ItemController.createItem); //Admin Only
router.put("/update-item", AuthUser.verifyUser, AuthUser.adminOnly, ItemController.updateItem); //Admin Only
router.delete("/delete-item", AuthUser.verifyUser, AuthUser.adminOnly, ItemController.deleteItem); //Admin Only
router.get("/item/:id?", AuthUser.verifyUser, ItemController.getItem);

//Checkout (Pinjam)
router.post("/checkout/:itemId", AuthUser.verifyUser, CheckoutController.checkoutItem);
router.post("/return/:itemId", AuthUser.verifyUser, CheckoutController.returnItem);
router.get("/checkouted-items", AuthUser.verifyUser, CheckoutController.getCheckoutedItem);

export default router;
