import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  getOrdersByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *               - totalPrice
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *               shippingAddress:
 *                 type: object
 *               paymentMethod:
 *                 type: string
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/orders/mine:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders list
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/total-orders:
 *   get:
 *     summary: Get total number of orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total orders count
 */

/**
 * @swagger
 * /api/orders/total-sales:
 *   get:
 *     summary: Get total sales
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total sales amount
 */

/**
 * @swagger
 * /api/orders/total-sales-by-date:
 *   get:
 *     summary: Get total sales by date
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Sales data grouped by date
 */

/**
 * @swagger
 * /api/orders/total-orders-by-date:
 *   get:
 *     summary: Get orders by date
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders data grouped by date
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Mark order as paid
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Order marked as paid
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Mark order as delivered (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Order marked as delivered
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/total-orders-by-date").get(getOrdersByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
