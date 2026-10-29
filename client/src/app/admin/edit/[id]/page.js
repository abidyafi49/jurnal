"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { getCurrentUser, getPostById, updatePost } from "@/services/api";
import RichTextEditor from "@/components/RichTextEditor";

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
    const [showPreview, setShowPreview] = useState("");


  const [form, setForm] = useState({
    title: "",
    category: "other",
    content: "",
      isPublished: false,
    coverImage: "",
  });
    
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");

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
          coverImage: article.coverImage || "",
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
    
    useEffect(() => {
      if (!coverFile) {
        setCoverPreview("");
        return;
      }

      const previewUrl = URL.createObjectURL(coverFile);
      setCoverPreview(previewUrl);

      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }, [coverFile]);

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
        coverImage: coverFile
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
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowPreview((previous) => !previous)}
              className="rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
            >
              {showPreview ? "Tutup Preview" : "Lihat Preview"}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {showPreview && (
            <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                <p className="text-sm font-medium text-gray-500">
                  ARTICLE PREVIEW
                </p>
                <p className="text-xs text-gray-400">
                  Pratinjau berdasarkan isi form saat ini
                </p>
              </div>

              <article className="px-6 py-8 sm:px-10">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  {categories.find(
                    (category) => category.value === form.category,
                  )?.label || form.category}
                </p>

                <h2 className="text-3xl font-bold leading-tight text-gray-900">
                  {form.title.trim() || "Judul artikel kamu"}
                </h2>

                <div className="my-6 border-b border-gray-200" />

                <div className="whitespace-pre-wrap wrap-break-word text-base leading-8 text-gray-700">
                  {form.content || "Isi artikel kamu akan tampil di sini."}
                </div>

                <div className="mt-8 border-t border-gray-200 pt-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      form.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {form.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </article>
            </section>
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

            {/* Gambar Sampul */}
            <div>
              <label
                htmlFor="coverImage"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Gambar Sampul
              </label>

              <input
                id="coverImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) return;

                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                  ];

                  if (!allowedTypes.includes(file.type)) {
                    setError("Pilih gambar JPG, PNG, atau WEBP.");
                    event.target.value = "";
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    setError("Ukuran gambar maksimal 5 MB.");
                    event.target.value = "";
                    return;
                  }

                  setError("");
                  setCoverFile(file);
                }}
                className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG, atau WEBP. Maksimal 5 MB. Kosongkan jika tidak ingin
                mengganti gambar.
              </p>

              {(coverPreview || form.coverImage) && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    {coverFile ? "Preview gambar baru" : "Gambar saat ini"}
                  </p>

                  <img
                    src={
                      coverPreview || `http://localhost:5000${form.coverImage}`
                    }
                    alt="Gambar sampul artikel"
                    className="max-h-80 w-full rounded-xl border border-gray-200 object-cover"
                  />

                  {coverFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        const input = document.getElementById("coverImage");
                        if (input) input.value = "";
                      }}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Batalkan gambar baru
                    </button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Isi Artikel
              </label>

              <RichTextEditor
                value={form.content}
                onChange={(content) =>
                  setForm((previous) => ({
                    ...previous,
                    content,
                  }))
                }
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