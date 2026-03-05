import express from "express";
const router = express.Router();

import {
  getCart,
  addToCart,
  removeFromCart,
  updateShippingAddress,
  updatePaymentMethod,
  clearCart,
} from "../controllers/cartController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

router.route("/").get(authenticate, getCart);
router.route("/add").post(authenticate, addToCart);
router.route("/remove/:productId").delete(authenticate, removeFromCart);
router.route("/shipping").put(authenticate, updateShippingAddress);
router.route("/payment").put(authenticate, updatePaymentMethod);
router.route("/clear").delete(authenticate, clearCart);

export default router;
