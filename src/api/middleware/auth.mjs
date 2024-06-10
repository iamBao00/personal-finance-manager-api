import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = "bao123";

// Middleware để xác thực token và thiết lập thông tin người dùng trong req.user
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ tiêu đề Authorization
    const token = req.headers.authorization;
    console.log(req.headers.authorization);
    if (!token || !token.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decodedToken = jwt.verify(token.split(" ")[1], ACCESS_TOKEN_SECRET);
    req.user = decodedToken.user;
    console.log(req.user);
    next();
  } catch (error) {
    console.error(`Error from authenticateToken middleware: ${error}`);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authenticateToken;
