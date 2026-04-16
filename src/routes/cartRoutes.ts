import express from "express";
const router = express.Router();

import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQty,
  updateShippingAddress,
  updatePaymentMethod,
  clearCart,
} from "../controllers/cartController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management endpoints
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
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
 *               - qty
 *             properties:
 *               productId:
 *                 type: string
 *               qty:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product added to cart
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
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
 *         description: Product removed from cart
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart/update/{productId}:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qty
 *             properties:
 *               qty:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart quantity updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart/shipping:
 *   put:
 *     summary: Update shipping address
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - city
 *               - postalCode
 *               - country
 *             properties:
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shipping address updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart/payment:
 *   put:
 *     summary: Update payment method
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment method updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */

router.route("/").get(authenticate, getCart);
router.route("/add").post(authenticate, addToCart);
router.route("/remove/:productId").delete(authenticate, removeFromCart);
router.route("/update/:productId").put(authenticate, updateCartQty);
router.route("/shipping").put(authenticate, updateShippingAddress);
router.route("/payment").put(authenticate, updatePaymentMethod);
router.route("/clear").delete(authenticate, clearCart);

export default router;
