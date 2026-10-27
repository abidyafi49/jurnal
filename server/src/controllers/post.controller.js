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

  async getById(req, res, next) {
    try {
      const post = await postService.getPostDetails(req.params.id);

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updatedPost = await postService.updatePost(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Artikel berhasil diperbarui",
        data: updatedPost,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await postService.deletePost(req.params.id);

      res.status(200).json({
        success: true,
        message: "Artikel berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();