const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");

// Endpoint Admin & Public
router.post("/", postController.create);
router.get("/admin", postController.getAllForAdmin);
router.get("/newspaper", postController.getPublished);

module.exports = router;
