const mongoose = require("mongoose")
const postRepository = require('../repositories/post.repository')

class PostService {
  async createPost(postData) {
    return await postRepository.create(postData);
  }

  async getAllPostsForAdmin() {
    return await postRepository.findAll();
  }

  async getPublishedPostsForNewspaper() {
    return await postRepository.findPublished();
  }

  async getPostDetails(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("ID artikel tidak valid");
      error.statusCode = 400;
      throw error;
    }

    const post = await postRepository.findById(id);

    if (!post) {
      const error = new Error("Artikel tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return post;
  }

  async updatePost(id, postData) {
    await this.getPostDetails(id);

    const allowedFields = ["title", "content", "category", "isPublished"];

    const updateData = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(postData, field)) {
        updateData[field] = postData[field];
      }
    }

    if (
      "title" in updateData &&
      (typeof updateData.title !== "string" || !updateData.title.trim())
    ) {
      const error = new Error("Judul wajib diisi");
      error.statusCode = 400;
      throw error;
    }

    if (
      "content" in updateData &&
      (typeof updateData.content !== "string" || !updateData.content.trim())
    ) {
      const error = new Error("Konten wajib diisi");
      error.statusCode = 400;
      throw error;
    }

    if (
      "category" in updateData &&
      !["python", "ros", "rl", "korean", "english", "daily", "other"].includes(
        updateData.category,
      )
    ) {
      const error = new Error("Kategori tidak valid");
      error.statusCode = 400;
      throw error;
    }

    if (
      "isPublished" in updateData &&
      typeof updateData.isPublished !== "boolean"
    ) {
      const error = new Error("Status publikasi tidak valid");
      error.statusCode = 400;
      throw error;
    }

    return await postRepository.updateById(id, updateData);
  }

  async deletePost(id) {
    await this.getPostDetails(id);
    return await postRepository.deleteById(id);
  }
}

module.exports = new PostService();