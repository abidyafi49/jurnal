const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const {
    authenticate,
    authorize
} = require("../middlewares/auth.middleware");

// Endpoint Admin & Public
router.post("/", authenticate, authorize("admin"), postController.create);
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  postController.getAllForAdmin,
);
router.get("/newspaper", postController.getPublished);

module.exports = router;
