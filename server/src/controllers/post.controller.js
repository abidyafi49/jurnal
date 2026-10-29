const postService = require("../services/post.service");
const fs = require("fs/promises");
const path = require("path");

const coversDir = path.join(__dirname, "../../uploads/covers");

async function removeCoverImage(coverImage) {
  // Hanya hapus file yang berada di folder cover milik aplikasi.
  if (
    typeof coverImage !== "string" ||
    !coverImage.startsWith("/uploads/covers/")
  ) {
    return;
  }

  const filename = path.basename(coverImage);
  if (!filename || filename !== coverImage.slice("/uploads/covers/".length)) {
    return;
  }

  try {
    await fs.unlink(path.join(coversDir, filename));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Gagal menghapus gambar sampul:", error);
    }
  }
}

async function removeUploadedFile(file) {
  if (!file?.filename) return;

  await removeCoverImage(`/uploads/covers/${file.filename}`);
}

function normalizePublished(value) {
  if (value === undefined) return undefined;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;

  const error = new Error("Status publikasi tidak valid");
  error.statusCode = 400;
  throw error;
}

class PostController {
  async create(req, res, next) {
    try {
      const postData = { ...req.body };

      postData.isPublished = normalizePublished(postData.isPublished);

      // Jangan menerima path gambar sembarang dari request body.
      delete postData.coverImage;

      if (req.file) {
        postData.coverImage = `/uploads/covers/${req.file.filename}`;
      }

      const newPost = await postService.createPost(postData);

      res.status(201).json({
        success: true,
        message: "Catatan berhasil dibuat",
        data: newPost,
      });
    } catch (error) {
      try {
        await removeUploadedFile(req.file);
      } catch (cleanupError) {
        console.error("Gagal membersihkan file upload:", cleanupError);
      }
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
    let oldCoverImage;

    try {
      const currentPost = await postService.getPostDetails(req.params.id);
      oldCoverImage = currentPost.coverImage;

      const postData = { ...req.body };

      postData.isPublished = normalizePublished(postData.isPublished);

      // Hanya mengganti gambar jika file baru benar-benar diupload.
      delete postData.coverImage;

      if (req.file) {
        postData.coverImage = `/uploads/covers/${req.file.filename}`;
      }

      const updatedPost = await postService.updatePost(req.params.id, postData);

      if (req.file && oldCoverImage) {
        await removeCoverImage(oldCoverImage);
      }

      res.status(200).json({
        success: true,
        message: "Artikel berhasil diperbarui",
        data: updatedPost,
      });
    } catch (error) {
      try {
        await removeUploadedFile(req.file);
      } catch (cleanupError) {
        console.error("Gagal membersihkan file upload:", cleanupError);
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const currentPost = await postService.getPostDetails(req.params.id);

      await postService.deletePost(req.params.id);

      if (currentPost.coverImage) {
        await removeCoverImage(currentPost.coverImage);
      }

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
