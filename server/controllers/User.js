import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";
import mongoose from "mongoose";
import product from "../models/Products.js";

dotenv.config();

// Register
export const UserRegister = async (req, res, next) => {
    try {
        const { email, password, name, img } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(409, "Email is already in use"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            img,
        });

        const createdUser = await user.save();
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
            expiresIn: "9999 years",
        });

        return res.status(200).json({ token, user: createdUser });
    } catch (err) {
        return next(err);
    }
};

// Login
export const UserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(createError(404, "User not found"));
        }

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            return next(createError(403, "Incorrect password"));
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT, {
            expiresIn: "9999 years",
        });

        return res.status(200).json({ token, user: existingUser });
    } catch (err) {
        return next(err);
    }
};

// Add to Cart ✅
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);

        // Ensure the product exists
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const productExists = await Product.findById(productObjectId);
        if (!productExists) {
            return next(createError(404, "Product not found"));
        }

        const existingCartItemIndex = user.cart.findIndex((item) =>
            item?.product?.equals(productObjectId)
        );

        if (existingCartItemIndex !== -1) {
            user.cart[existingCartItemIndex].quantity += quantity;
        } else {
            user.cart.push({ product: productObjectId, quantity });
        }

        await user.save();
        return res.status(200).json({ message: "Product added to cart successfully", user });
    } catch (err) {
        next(err);
    }
};

// Remove from Cart ✅
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);

        if (!user) return next(createError(404, "User not found"));

        const productObjectId = new mongoose.Types.ObjectId(productId);

        const productIndex = user.cart.findIndex((item) =>
            item.product.equals(productObjectId)
        );

        if (productIndex !== -1) {
            if (quantity && quantity > 0) {
                user.cart[productIndex].quantity -= quantity;
                if (user.cart[productIndex].quantity <= 0) {
                    user.cart.splice(productIndex, 1);
                }
            } else {
                user.cart.splice(productIndex, 1);
            }

            await user.save();
            return res.status(200).json({ message: "Product quantity updated in cart", user });
        } else {
            return next(createError(404, "Product not found in the user's cart"));
        }
    } catch (err) {
        next(err);
    }
};

// Get All Cart Items ✅
export const getAllCartItems = async (req, res, next) => {
    try {
        const userJWT = req.user;
        const user = await User.findById(userJWT.id).populate({
            path: "cart.product",
            model: "Products",
        });

        const cartItems = user.cart;
        return res.status(200).json(cartItems);
    } catch (err) {
        next(err);
    }
};

// Place Order
export const placeOrder = async (req, res, next) => {
    try {
        const { products, address, totalAmount } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);

        const order = new Orders({
            products,
            user: user._id,
            total_amount: totalAmount,
            address,
        });

        await order.save();

        user.cart = [];
        await user.save();

        return res.status(200).json({ message: "Order placed successfully", order });
    } catch (err) {
        next(err);
    }
};

// Get All Orders
export const getAllOrders = async (req, res, next) => {
    try {
        const user = req.user;
        const orders = await Orders.find({ user: user.id });
        return res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

// Add to Favorites
export const addToFavorites = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userJWT = req.user;

        const user = await User.findById(userJWT.id);
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
        }

        return res.status(200).json({ message: "Product added to favorites successfully", user });
    } catch (err) {
        next(err);
    }
};

// Remove from Favorites
export const removeFromFavorites = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);

        user.favorites = user.favorites.filter((fav) => !fav.equals(productId));
        await user.save();

        return res.status(200).json({ message: "Product removed from favorites successfully", user });
    } catch (err) {
        next(err);
    }
};

// Get User Favorites
export const getUserFavourites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("favorites").exec();

        if (!user) {
            return next(createError(404, "User not found"));
        }

        return res.status(200).json(user.favorites);
    } catch (err) {
        next(err);
    }
};
