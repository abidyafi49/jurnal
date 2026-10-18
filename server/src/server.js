const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const postRoutes = require("./routes/post.routes");

const app = express();

// Middleware dasar
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/posts", postRoutes);

// Error Handling Middleware Sederhana
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server",
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
