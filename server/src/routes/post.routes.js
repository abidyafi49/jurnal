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

// Admin: detail satu artikel
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  postController.getById
);

// Admin: edit artikel atau ubah status publikasi
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  postController.update
);

// Admin: hapus artikel
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  postController.delete
);


module.exports = router;
