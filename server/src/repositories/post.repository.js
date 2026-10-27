const Post = require('../models/post.model');

class PostRepository {
  async create(postData) {
    const post = new Post(postData);
    return await post.save();
  }

  async findAll() {
    return await Post.find().sort({ createdAt: -1 });
  }

  async findPublished() {
    return await Post.find({ isPublished: true }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Post.findById(id);
  }

  async updateById(id, postData) {
    return await Post.findByIdAndUpdate(id, postData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await Post.findByIdAndDelete(id);
  }
}

module.exports = new PostRepository();