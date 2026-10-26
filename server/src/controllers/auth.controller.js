const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET belum dikonfigurasi");
      }

      const user = await authService.login(req.body);

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });

      res.cookie("pn_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res) {
    return res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  }

  async logout(req, res) {
    res.clearCookie("pn_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  }
}

module.exports = new AuthController();
