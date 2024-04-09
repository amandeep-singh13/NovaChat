const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const { accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup,clearChat} = require("../controllers/chatContollers")

router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchChats);
router.route("/group").post(protect,createGroupChat);
router.route("/rename").put(protect,renameGroup);
router.route("/groupremove").put(protect,removeFromGroup);
router.route("/groupadd").put(protect,addToGroup);
router.route("/clearChat/:chatId").delete(protect, clearChat);

module.exports = router;