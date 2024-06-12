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
        return res.status(201).json({
          _id: user.id,
          email: user.email,
          username: user.username,
        });
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
        user: {
          _id: user.id,
          email: user.email,
          username: user.username,
          balance: user.balance,
        },
      });
    } catch (error) {
      console.error(`Error from UserService.loginUser: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async loginAdmin(req, res) {
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
      if (password !== user.password) {
        return res.status(400).json({ message: "Invalid password!" });
      }
      console.log("admin ne:" + user);
      console.log(user.admin);
      if (user.admin !== "true") {
        return res.status(403).json({ message: "User is not an admin!" });
      }
      const token = jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      return res.status(200).json({
        token,
        user: {
          _id: user.id,
          email: user.email,
          username: user.username,
          admin: user.admin,
        },
      });
    } catch (error) {
      console.error(`Error from UserService.loginAdmin: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async currentUser(req, res) {
    try {
      const userId = req.user._id; // Lấy ID người dùng từ token đã giải mã
      const currentUser = await User.findById(userId).select(
        "-password -admin"
      ); // Tìm người dùng theo ID và bỏ qua các trường không cần thiết

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(currentUser);
      // Trả về thông tin người dùng từ req.user đã được thiết lập trong middleware authenticateToken
      // return res.status(200).json(req.user);
    } catch (error) {
      console.error(`Error from UserService.currentUser: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Hàm listUser
  async listUser(req, res) {
    try {
      let users = await User.find().select("-password");
      users = users.filter((user) => user.admin !== "true");
      return res.status(200).json(users);
    } catch (error) {
      console.error(`Error from UserService.listUser: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Hàm deleteUser, có thể delete cả admin nhưng khi quan lí chỉ list ra những normal user trên giao diện
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(`Error from UserService.deleteUser: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserService();
