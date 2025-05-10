import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import UserRouter from "./routes/User.js";
import ProductRoutes from "./routes/Products.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // ⚠️ Change this to your frontend domain on production
    credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/user", UserRouter);
app.use("/api/products", ProductRoutes);

// Serve static files from React
app.use(express.static(path.join(__dirname, "client/build")));

// Handle React routing, return index.html for unknown routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

// Connect DB and start server
const connectDB = async () => {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to MONGO DB");
};

const startServer = async () => {
    try {
        await connectDB();
        app.listen(8080, () => console.log("🚀 Server started on port 8080"));
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();
