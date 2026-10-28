"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost, getCurrentUser } from "@/services/api";
import RichTextEditor from "@/components/RichTextEditor";

export default function CreatePostPage() {
  const router = useRouter();

  // State form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("python");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const result = await getCurrentUser();

      if (!active) return;

      if (!result.success || !result.data?.user) {
        router.replace("/login");
        return;
      }

      if (result.data.user.role !== "admin") {
        router.replace("/newspaper");
        return;
      }

      setCheckingAccess(false);
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [router]);

  // Handle submit form ke Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!title || !content) {
      setErrorMessage("Judul dan Konten wajib diisi!");
      setLoading(false);
      return;
    }

    const payload = {
      title,
      category,
      content,
      isPublished,
    };

    const result = await createPost(payload);

    if (result.success) {
      // Jika berhasil, arahkan kembali ke halaman Admin Dashboard
      router.push("/admin");
    } else {
      setErrorMessage(result.message || "Gagal menyimpan catatan");
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memeriksa akses...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Navigasi Kecil */}
        <div className="mb-6 flex justify-between items-center">
          <a
            href="/admin"
            className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1"
          >
            ← Kembali ke Dashboard
          </a>
          <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-semibold">
            Admin Content Studio
          </span>
        </div>

        {/* Card Container Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tulis Jurnal & Progres Baru 📝
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Catat apa yang kamu pelajari hari ini (Python, ROS, Bahasa Korea,
            dll.). Catatan ini bisa langsung dipublikasikan ke *Personal
            Newspaper* atau disimpan sebagai *Draft*.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Judul */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Catatan / Topik Pembelajaran
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Belajar ROS Publisher dan Subscriber - Day 1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
                required
              />
            </div>

            {/* Pilihan Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori Skill
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm bg-white"
              >
                <option value="python">Python Programming</option>
                <option value="ros">ROS (Robot Operating System)</option>
                <option value="rl">Reinforcement Learning</option>
                <option value="korean">Bahasa Korea (한국어)</option>
                <option value="english">Bahasa Inggris</option>
                <option value="daily">Daily Journal & Productivity</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            {/* Input Konten / Isi Jurnal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Isi Catatan / Rangkuman Pembelajaran
              </label>
              <RichTextEditor
                value={content}
                onChange={(value) => setContent(value)}
              />
            </div>

            {/* Pilihan Status Publikasi (Checkbox) */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <div>
                <label
                  htmlFor="isPublished"
                  className="text-sm font-semibold text-gray-800 cursor-pointer"
                >
                  Publikasikan ke Personal Newspaper
                </label>
                <p className="text-xs text-gray-500">
                  Jika dicentang, catatan ini akan tampil di halaman publik
                  untuk portofolio dan review. Jika tidak, hanya tersimpan
                  sebagai *draft* privat.
                </p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <a
                href="/admin"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition"
              >
                Batal
              </a>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Catatan 🚀"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
