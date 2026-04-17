import express from "express";
const router = express.Router();

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management endpoints
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/wishlist/remove/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       401:
 *         description: Unauthorized
 */

router.route("/").get(authenticate, getWishlist);
router.route("/add").post(authenticate, addToWishlist);
router.route("/remove/:productId").delete(authenticate, removeFromWishlist);

export default router;
