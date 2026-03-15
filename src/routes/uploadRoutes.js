import express from "express";
import { uploadProductImage } from "../controllers/uploadController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  uploadProductImage
);

export default router;