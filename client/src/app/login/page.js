"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const result = await loginUser({ email, password });

    if (!result.success) {
      setErrorMessage(result.message || "Login gagal.");
      setLoading(false);
      return;
    }

    const user = result.data?.user;

    if (!user) {
      setErrorMessage("Data pengguna tidak ditemukan dari server.");
      setLoading(false);
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/newspaper");
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <Link href="/" className="text-sm text-stone-500 hover:text-stone-900">
          ← Kembali ke beranda
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-stone-500">
          Personal Newspaper
        </p>

        <h1 className="text-3xl font-bold text-stone-900 mt-2">
          Selamat datang kembali
        </h1>

        <p className="text-sm text-stone-600 mt-2 mb-6">
          Login untuk melanjutkan perjalanan belajarmu.
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-900 px-4 py-3 font-medium text-white hover:bg-stone-700 disabled:opacity-60"
          >
            {loading ? "Sedang login..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-stone-600 mt-6">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-stone-900 underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
