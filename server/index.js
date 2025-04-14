import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import UserRouter from "./routes/User.js";
import ProductRoutes from "./routes/Products.js";
dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    }));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true }));

//error handle
app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong"
    return res.status(status).json ({
        success: false,
        status,
        message,
    });
});

app.get("/",async(req,res) =>{
    res.status(200).json({
        message : "Hello GFG Developers",
    });
});

app.use("/api/user", UserRouter);
app.use("/api/products", ProductRoutes);

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