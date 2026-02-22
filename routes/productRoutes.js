import express from "express";
const router = express.Router();

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router.get("/", fetchProducts);

router.get("/allproducts", fetchAllProducts);

router.get("/top", fetchTopProducts);

router.get("/new", fetchNewProducts);

router.get("/:id", fetchProductById);

router.post("/", authenticate, authorizeAdmin, addProduct);

router.put("/:id", authenticate, authorizeAdmin, updateProductDetails);

router.delete("/:id", authenticate, authorizeAdmin, removeProduct);

router.post("/:id/reviews", authenticate, checkId, addProductReview);

router.post("/filtered-products", filterProducts);

export default router;
