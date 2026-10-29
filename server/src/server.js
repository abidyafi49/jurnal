const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");

const postRoutes = require("./routes/post.routes");
const authRoutes = require("./routes/auth.routes")

const app = express();

// Middleware dasar
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Error Handling Middleware Sederhana

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Ukuran gambar maksimal 5 MB"
          : "Upload gambar gagal",
    });
  }

  if (err.message === "Format gambar harus JPG, PNG, atau WEBP") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email sudah terdaftar",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode < 500 ? err.message : "Terjadi kesalahan pada server",
  });
});


// Koneksi Database & Jalankan Server
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/jurnal";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database MongoDB terhubung!");
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung ke database:", err);
  });
