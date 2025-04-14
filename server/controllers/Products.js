import mongoose from "mongoose";
import Products from "../models/Products.js";
import { createError } from "../error.js";

// Add Products Controller
export const addProducts = async (req, res, next) => {
  try {
    const productsData = req.body;

    if (!Array.isArray(productsData)) {
      return next(
        createError(400, "Invalid request. Expected an array of products")
      );
    }

    const createdProducts = [];

    for (const productInfo of productsData) {
      const { title, name, desc, img, price, sizes, category } = productInfo;

      const product = new Products({
        title,
        name,
        desc,
        img,
        price,
        sizes,
        category,
      });

      const createdProduct = await product.save();
      createdProducts.push(createdProduct);
    }

    return res
      .status(201)
      .json({ message: "Products added successfully", createdProducts });
  } catch (err) {
    next(err);
  }
};

// Get Products with Filters
export const getproducts = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, sizes, search } = req.query;

    // Convert query strings to arrays
    sizes = sizes ? sizes.split(",") : [];
    categories = categories ? categories.split(",") : [];

    const filter = {};

    if (categories.length > 0) {
      filter.category = { $in: categories };
    }

    if (minPrice || maxPrice) {
      filter["price.org"] = {};
      if (minPrice) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice); // ✅ Fix: Changed to $lte
      }
    }

    if (sizes.length > 0) {
      filter.sizes = { $in: sizes };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { desc: { $regex: new RegExp(search, "i") } },
      ];
    }

    const products = await Products.find(filter);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// Get Product by ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid Product ID"));
    }

    const product = await Products.findById(id);

    if (!product) {
      return next(createError(404, "Product not found")); 
    }

    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};
