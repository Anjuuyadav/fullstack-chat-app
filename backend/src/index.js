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
const __dirname = path.resolve();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "producttion"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

connectDB();

server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
    
});