const postRepository = require('../repositories/post.repository')

class PostService{
    async createPost(postData) {
        return await postRepository.create(postData)
    }

    async getAllPostsForAdmin() {
        return await postRepository.findAll()
    }

    async getPublishedPostsForNewspaper() {
        return await postRepository.findPublished();
    }

    async getPostDetails(id) {
        const post = await postRepository.findById(id);
        if (!post) {
            throw new Error('Catatan tidak ditemukan')
        }
        return post;
    }
}

module.exports = new PostService();