const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");

class AuthService {
  async register({ name, email, password }) {
    // Validasi input dasar
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      const error = new Error("Data registrasi tidak valid");
      error.statusCode = 400;
      throw error;
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (name.length < 2 || name.length > 80) {
      const error = new Error("Nama harus terdiri dari 2–80 karakter");
      error.statusCode = 400;
      throw error;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length > 254 || !emailPattern.test(email)) {
      const error = new Error("Format email tidak valid");
      error.statusCode = 400;
      throw error;
    }

    // Batasi panjang sebelum proses hashing.
    // Batas 72 byte kompatibel dengan batas input bcrypt.
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      const error = new Error(
        "Password harus minimal 8 karakter dan maksimal 72 byte",
      );
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      const error = new Error("Email sudah terdaftar");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Jangan menerima role dari request publik.
    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role: "user",
    });

    // Jangan pernah mengirim password hash ke frontend.
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login({ email, password }) {
    if (typeof email !== "string" || typeof password !== "string") {
      const error = new Error("Email dan password wajib diisi");
      error.statusCode = 400;
      throw error;
    }

    email = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(email);

    // Gunakan pesan umum agar tidak membocorkan apakah email terdaftar.
    if (!user) {
      const error = new Error("Email atau password salah");
      error.statusCode = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      const error = new Error("Email atau password salah");
      error.statusCode = 401;
      throw error;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

module.exports = new AuthService();
