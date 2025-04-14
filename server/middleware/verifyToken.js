import jwt from "jsonwebtoken";
import { createError } from "../error.js";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createError(401, "You are not authenticated!"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded; // attach decoded user info to request
        next();
    } catch (err) {
        return next(createError(403, "Invalid or expired token!"));
    }
};

export default verifyToken;
