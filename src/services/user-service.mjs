import User from "../database/models/user-model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = "bao123";

class UserService {
  async registerUser(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "Username, email, and password are all mandatory!",
        });
      }
      const userAvailable = await User.findOne({ username });
      if (userAvailable) {
        return res.status(400).json({ message: "Username already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password: " + hashedPassword);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      if (user) {
        return res
          .status(201)
          .json({ _id: user.id, email: user.email, username: user.username });
      } else {
        return res.status(400).json({ message: "User data is not valid" });
      }
    } catch (error) {
      console.error(`Error from UserService.registerUser: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are both required!" });
      }
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password!" });
      }
      const token = jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      return res.status(200).json({
        token,
        user: { _id: user.id, email: user.email, username: user.username },
      });
    } catch (error) {
      console.error(`Error from UserService.loginUser: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async currentUser(req, res) {
    try {
      // Trả về thông tin người dùng từ req.user đã được thiết lập trong middleware authenticateToken
      return res.status(200).json(req.user);
    } catch (error) {
      console.error(`Error from UserService.currentUser: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserService();
