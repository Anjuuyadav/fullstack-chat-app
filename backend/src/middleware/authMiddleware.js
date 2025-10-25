import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token" });
    }

    const existingUser = await User.findById(decode.userId).select("-password");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = existingUser;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default protectRoute;
