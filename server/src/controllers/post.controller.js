const postService = require("../services/post.service");

class PostController {
  async create(req, res, next) {
    try {
      const newPost = await postService.createPost(req.body);
      res.status(201).json({
        success: true,
        message: "Catatan berhasil dibuat",
        data: newPost,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllForAdmin(req, res, next) {
    try {
      const posts = await postService.getAllPostsForAdmin();
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublished(req, res, next) {
    try {
      const posts = await postService.getPublishedPostsForNewspaper();
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();