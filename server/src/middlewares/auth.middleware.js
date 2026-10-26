const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.pn_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Sesi tidak valid",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Sesi tidak valid atau sudah kedaluwarsa",
      });
    }

    next(error);
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Kamu tidak memiliki izin untuk mengakses resource ini",
      });
    }

    next();
  };
}

module.exports = { authenticate, authorize };
