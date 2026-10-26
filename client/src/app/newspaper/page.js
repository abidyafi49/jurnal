"use client";

import { useState, useEffect } from "react";
import { fetchPublishedPosts } from "@/services/api";

export default function NewspaperPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  let active = true;

  async function loadPublishedData() {
    try {
      const result = await fetchPublishedPosts();

      if (!active) return;

      const articles = Array.isArray(result?.data) ? result.data : [];

      setPosts(articles);
    } catch (error) {
      console.error("Gagal memuat artikel:", error);

      if (active) {
        setPosts([]);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  loadPublishedData();

  return () => {
    active = false;
  };
}, []);


  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 p-6 md:p-12 font-serif">
      <div className="max-w-4xl mx-auto">
        {/* Header Ala Koran / Majalah Klasik */}
        <header className="border-b-2 border-gray-900 pb-6 mb-8 text-center">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            Personal Tech & Language Journal • Edition 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
            The Dev Newspaper
          </h1>
          <p className="text-sm italic text-gray-600 mt-2">
            Dokumentasi perjalanan belajar Python, ROS, Reinforcement Learning,
            dan Bahasa Korea.
          </p>
        </header>

        {/* Content Feed */}
        <main>
          {loading ? (
            <p className="text-center font-sans text-gray-400 py-12">
              Menerbitkan halaman koran...
            </p>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
              <p className="text-gray-500 font-sans mb-4">
                Belum ada artikel publik yang diterbitkan.
              </p>
              <a
                href="/admin/create"
                className="inline-block bg-gray-900 text-white px-4 py-2 rounded font-sans text-sm hover:bg-gray-800 transition"
              >
                Publikasikan Catatan Pertama
              </a>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="border-b border-gray-200 pb-8"
                >
                  <div className="flex items-center gap-3 text-xs font-sans text-gray-500 mb-2">
                    <span className="uppercase tracking-wider bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-semibold">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        dateStyle: "long",
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition">
                    {post.title}
                  </h2>

                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base font-sans">
                    {post.content}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-gray-300 text-center text-xs font-sans text-gray-500">
          <p>
            © 2026 Jurnal Abid.
          </p>
        </footer>
      </div>
    </div>
  );
}
