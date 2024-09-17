import UserModel from "../Models/UserModel.js";
import validateEmail from "../Utils/EmailValidator.js";
import bcrypt from "bcrypt";

class AuthControllers {
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword, role } = req.body;
      if (!name) throw { message: "Please Input Name" };
      if (!email) throw { message: "Please Input Email" };

      const validEmail = validateEmail(email);
      if (!validEmail) throw { message: "Email is Not Valid" };

      const existingUser = await UserModel.findOne({ where: { email } });
      if (existingUser) throw { message: "Email is already in use" };

      if (!password) throw { message: "Please Input Password" };
      if (password !== confirmPassword)
        throw { message: "Password and Confirm Password is Not Same" };

      if (!role) throw { message: "Please Input Role" };

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.password;

      res.status(201).json({
        status: true,
        message: "Register Success",
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { name, password } = req.body;
      if (!name) throw { message: "Please Input Name" };
      if (!password) throw { message: "Please Input Password" };

      const user = await UserModel.findOne({ where: { name } });
      if (!user) throw { message: "User Not Found" };

      const matchedPassword = await bcrypt.compare(password, user.password);
      if (!matchedPassword) throw { message: "Password Incorrect" };

      req.session.userId = user.id;

      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({
        status: true,
        message: "Login Succesful",
        data: userInfo,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthControllers();
