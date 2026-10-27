"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { getCurrentUser, getPostById, updatePost } from "@/services/api";

const categories = [
  { value: "python", label: "Python" },
  { value: "ros", label: "ROS" },
  { value: "rl", label: "Reinforcement Learning" },
  { value: "korean", label: "Korean" },
  { value: "english", label: "English" },
  { value: "daily", label: "Daily" },
  { value: "other", label: "Other" },
];

function EditArticleForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "other",
    content: "",
    isPublished: false,
  });

  // Periksa sesi admin dan ambil artikel
  useEffect(() => {
    let active = true;

    async function loadArticle() {
      try {
        const session = await getCurrentUser();

        if (!active) return;

        if (!session.success || !session.data?.user) {
          router.replace("/login");
          return;
        }

        if (session.data.user.role !== "admin") {
          router.replace("/newspaper");
          return;
        }

        const result = await getPostById(id);

        if (!active) return;

        if (!result.success) {
          if (result.status === 401) {
            router.replace("/login");
            return;
          }

          if (result.status === 403) {
            router.replace("/newspaper");
            return;
          }

          setError(result.message || "Artikel gagal dimuat.");
          return;
        }

        // Mendukung respons data artikel secara langsung
        // maupun respons yang membungkusnya dalam properti post.
        const article =
          result.data?.post ?? result.data?.article ?? result.data;

        if (!article || typeof article.title !== "string") {
          setError("Data artikel tidak ditemukan.");
          return;
        }

        setForm({
          title: article.title || "",
          category: article.category || "other",
          content: article.content || "",
          isPublished: Boolean(article.isPublished),
        });
      } catch (err) {
        if (active) {
          setError("Terjadi kesalahan saat memuat artikel.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadArticle();
    }

    return () => {
      active = false;
    };
  }, [id, router]);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Judul dan isi artikel wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const result = await updatePost(id, {
        title: form.title.trim(),
        category: form.category,
        content: form.content,
        isPublished: form.isPublished,
      });

      if (!result.success) {
        if (result.status === 401) {
          router.replace("/login");
          return;
        }

        if (result.status === 403) {
          router.replace("/newspaper");
          return;
        }

        setError(result.message || "Artikel gagal diperbarui.");
        return;
      }

      setMessage("Artikel berhasil diperbarui!");

      // Kembali ke dashboard setelah berhasil menyimpan
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan artikel.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Memuat artikel...</p>
      </main>
    );
  }

  if (error && !form.title && !form.content) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
          <p className="mb-4 text-red-600">{error}</p>
          <Link href="/admin" className="text-blue-600 hover:underline">
            Kembali ke dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Kembali ke dashboard
        </Link>

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>

          <p className="mt-2 text-sm text-gray-500">
            Perbarui informasi dan status publikasi artikel.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Judul Artikel
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={200}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Masukkan judul artikel"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Kategori
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Isi Artikel
              </label>

              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={12}
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Tulis isi artikel di sini..."
              />
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />

                <span>
                  <span className="block font-medium text-gray-800">
                    Publikasikan artikel
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    {form.isPublished
                      ? "Artikel berstatus Published."
                      : "Artikel berstatus Draft dan belum tampil di koran."}
                  </span>
                </span>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/admin"
                className="rounded-lg border border-gray-300 px-5 py-3 text-center font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function EditArticlePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-8">
          <p className="text-gray-600">Memuat halaman edit...</p>
        </main>
      }
    >
      <EditArticleForm />
    </Suspense>
  );
}