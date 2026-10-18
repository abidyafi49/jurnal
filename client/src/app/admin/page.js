"use client";

import { useState, useEffect } from "react";
import { fetchAdminPosts } from "@/services/api";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchAdminPosts();
      setPosts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header ala Dashboard */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Hello, Developer! 👋
            </h1>
            <p className="text-gray-500">
              Kelola catatan belajar Python, ROS, dan Bahasa Koreamu di sini.
            </p>
          </div>
          <a
            href="/admin/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            + Buat Catatan Baru
          </a>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Daftar Jurnal & Catatan
          </h2>

          {loading ? (
            <p className="text-gray-400">Memuat data dari server...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400">
              Belum ada catatan. Yuk mulai tulis progres pertamamu hari ini!
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div>
                    <span className="text-xs uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-semibold mr-2">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-800 inline-block mt-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                      {post.content}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
