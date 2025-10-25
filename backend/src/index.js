const express = require("express");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv").config();
const connectDB = require("./lib/db");
const cookieParser = require("cookie-parser");
const {app, server} = require("./lib/socket");
const messageRoutes = require("./routes/messageRoutes");
const PORT = process.env.PORT || 3001
const cors = require("cors");
const path = require("path");

// app.use(express.json());
// const __dirname = path.resolve();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://fullstack-chat-app-frontend-f4ka.onrender.com" 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "producttion"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
};

connectDB();

server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
    
});