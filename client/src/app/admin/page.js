"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  fetchAdminPosts,
  getCurrentUser,
  logoutUser,
  updatePost,
  deletePost,
} from "@/services/api";

export default function AdminDashboard() {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [busyPostId, setBusyPostId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const session = await getCurrentUser();

        if (!active) return;

        if (!session.success || !session.data?.user) {
          router.replace("/login");
          return;
        }

        const currentUser = session.data.user;

        if (currentUser.role !== "admin") {
          router.replace("/newspaper");
          return;
        }

        setUser(currentUser);

        const result = await fetchAdminPosts();

        if (!active) return;

        if (result.status === 401) {
          router.replace("/login");
          return;
        }

        if (result.status === 403) {
          router.replace("/newspaper");
          return;
        }

        setPosts(
          result.success && Array.isArray(result.data) ? result.data : [],
        );

        if (!result.success) {
          setError(result.message || "Gagal memuat artikel.");
        }
      } catch (err) {
        if (active) {
          setError("Tidak dapat memuat artikel dari server.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleTogglePublish(post) {
    setBusyPostId(post._id);
    setError("");
    setMessage("");

    try {
      const result = await updatePost(post._id, {
        isPublished: !post.isPublished,
      });

      if (result.status === 401) {
        router.replace("/login");
        return;
      }

      if (!result.success) {
        setError(result.message || "Gagal mengubah status artikel.");
        return;
      }

      const updatedPost = result.data;

      setPosts((currentPosts) =>
        currentPosts.map((item) =>
          item._id === post._id
            ? {
                ...item,
                ...(updatedPost || {}),
                isPublished:
                  typeof updatedPost?.isPublished === "boolean"
                    ? updatedPost.isPublished
                    : !post.isPublished,
              }
            : item,
        ),
      );

      setMessage(
        !post.isPublished
          ? "Artikel berhasil dipublikasikan."
          : "Artikel berhasil dijadikan draft.",
      );
    } catch (err) {
      setError("Terjadi kesalahan saat mengubah status artikel.");
    } finally {
      setBusyPostId(null);
    }
  }

  async function handleDelete(post) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus artikel "${post.title}"? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) return;

    setBusyPostId(post._id);
    setError("");
    setMessage("");

    try {
      const result = await deletePost(post._id);

      if (result.status === 401) {
        router.replace("/login");
        return;
      }

      if (!result.success) {
        setError(result.message || "Gagal menghapus artikel.");
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.filter((item) => item._id !== post._id),
      );

      setMessage("Artikel berhasil dihapus.");
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus artikel.");
    } finally {
      setBusyPostId(null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logoutUser();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memeriksa akses admin...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Halo, {user.name}! 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Kelola artikel dan catatan Personal Newspaper kamu.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>

            <Link
              href="/admin/create"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              + Buat Artikel
            </Link>
          </div>
        </header>

        {message && (
          <div
            role="status"
            className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Daftar Artikel
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {posts.length} artikel
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Belum ada artikel. Yuk, buat artikel pertamamu!
              </p>

              <Link
                href="/admin/create"
                className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
              >
                Buat artikel sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const isBusy = busyPostId === post._id;

                return (
                  <article
                    key={post._id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-semibold">
                            {post.category}
                          </span>

                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              post.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {post.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 break-words">
                          {post.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 whitespace-pre-line">
                          {post.content}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Link
                          href={`/admin/edit/${post._id}`}
                          className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleTogglePublish(post)}
                          disabled={isBusy}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {isBusy
                            ? "Memproses..."
                            : post.isPublished
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          onClick={() => handleDelete(post)}
                          disabled={isBusy}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
