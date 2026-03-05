import express from "express";
const router = express.Router();

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

router.route("/").get(authenticate, getWishlist);
router.route("/add").post(authenticate, addToWishlist);
router.route("/remove/:productId").delete(authenticate, removeFromWishlist);

export default router;
