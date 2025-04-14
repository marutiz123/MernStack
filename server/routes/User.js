import express from "express";
import {
  addToCart,
  removeFromCart,
  getAllCartItems,
  getAllOrders,
  placeOrder,
  addToFavorites,
  removeFromFavorites,
  getUserFavourites,
  UserLogin,
  UserRegister,
} from "../controllers/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// User Registration & Login Routes
router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

// Cart Routes
router.get("/cart", verifyToken, getAllCartItems);
router.post("/cart", verifyToken, addToCart);  // Make sure this route is POST for adding items
router.delete("/cart", verifyToken, removeFromCart);

// Order Routes
router.get("/order", verifyToken, getAllOrders);
router.post("/order", verifyToken, placeOrder);

// Favorite Routes
router.get("/favorite", verifyToken, getUserFavourites);
router.post("/favorite", verifyToken, addToFavorites);
router.delete("/favorite", verifyToken, removeFromFavorites);

export default router;
