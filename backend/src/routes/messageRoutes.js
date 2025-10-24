const express = require("express");
const router = express.Router();
const {getUsersForSidebar, getMessages, sendMessage} = require("../controllers/messageControllers");
const protectRoute = require("../middleware/authMiddleware");
  
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;