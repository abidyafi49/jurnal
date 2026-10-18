const postService = require("../src/services/post.service");
const postRepository = require("../src/repositories/post.repository");

jest.mock("../src/repositories/post.repository");

describe('PostService Businees Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("Harus berhasil membuat post baru", async () => {
      const mockPostData = {
        title: "Belajar Reinforcement Learning",
        content: "Mengenal konsep Q-Learning dasar.",
        category: "rl",
        isPublished: true,
      };

      // Simulasi hasil kembalian dari repository
      postRepository.create.mockResolvedValue({
        _id: "60c72b2f9b1d8b0015f1e123",
        ...mockPostData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await postService.createPost(mockPostData);

      expect(postRepository.create).toHaveBeenCalledTimes(1);
      expect(postRepository.create).toHaveBeenCalledWith(mockPostData);
      expect(result).toHaveProperty("_id");
      expect(result.title).toBe("Belajar Reinforcement Learning");
    });

    test("Harus melemparkan error jika post berdasarkan ID tidak ditemukan", async () => {
      // Simulasi jika repository mengembalikan null (tidak ketemu)
      postRepository.findById.mockResolvedValue(null);

      await expect(postService.getPostDetails("id-palsu-123")).rejects.toThrow(
        "Catatan tidak ditemukan",
      );
    });
})