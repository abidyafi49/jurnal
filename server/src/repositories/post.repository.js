const Post = require('../models/post.model');

class PostRepository {
    async create(postData) {
        const post = new Post(postData);
        return await post.save();
    }

    async findAll() {
        return await Post.find().sort({createdAt: -1})
    }

    async findPublished() {
        return await Post.find({ isPublished: true }).sort({ createdAt: -1 });
    }

    async findById(id) {
        return await Post.findById(id)
    }
}

module.exports = new PostRepository();