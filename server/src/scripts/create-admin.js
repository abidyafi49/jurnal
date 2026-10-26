require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

async function createAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL, dan ADMIN_PASSWORD wajib diisi di .env",
      );
    }

    if (Buffer.byteLength(ADMIN_PASSWORD, "utf8") > 72) {
      throw new Error("Password maksimal 72 byte");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Password admin minimal 12 karakter");
    }

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGODB_URI belum diatur. Gunakan nama variabel koneksi MongoDB dari server.js.",
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "Email sudah terdaftar. Script ini tidak mengubah role akun yang ada.",
      );
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await User.create({
      name: ADMIN_NAME.trim(),
      email,
      passwordHash,
      role: "admin",
    });

    console.log("Admin berhasil dibuat:");
    console.log({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Gagal membuat admin:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
