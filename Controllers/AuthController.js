import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";

class AuthControllers {
  async login(req, res) {
    try {
      const { name, password } = req.body;
      if (!name) throw { message: "Please Input Name" };
      if (!password) throw { message: "Please Input Password" };

      const user = await UserModel.findOne({ where: { name } });
      if (!user) throw { message: "User Not Found" };

      const matchedPassword = await bcrypt.compare(password, user.password);
      if (!matchedPassword) throw { message: "Password Incorrect" };

      //Memasukkan ID dari user ke SESSION
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

  async logout(req, res) {
    try {
      if (!req.session.userId) {
        return res.status(400).json({
          status: false,
          message: "No active session, please login first!",
        });
      }

      req.session.destroy((error) => {
        if (error)
          res.status(400).json({
            status: false,
            message: "Logout failed",
          });
      });

      res.clearCookie("connect.sid");
      return res.status(200).json({
        status: true,
        message: "Logout succesful",
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
