import UserModel from "../Models/UserModel.js";

class UserController {
  async createUser(req, res) {
    try {
      const { nis, name, role, password } = req.body;
      
      if (!nis) throw { message: "Please Input NIS" };
      const existingUser = await UserModel.findOne({ where: { nis } });
      if (existingUser) throw { message: "NIS already in use" };

      if (!name) throw { message: "Please Input Name" };
      if (!role) throw { message: "Please Input Role" };
      if (!password) throw { message: "Please Input Password" };

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        nis,
        name,
        role,
        password: hashPassword,
      });
      if (!user) throw { message: "Failed to Create User" };

      return res.status(201).json({
        status: true,
        message: "Create User Successful",
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { password, newPassword } = req.body;
      if (!password) throw { message: "Please input password" };
      if (!newPassword) throw { message: "Please input new password" };

      const user = await UserModel.findOne({
        where: {
          id: req.userId,
        },
      });
      if (!user) throw { message: "User not found" };

      const matchedPassword = await bcrypt.compare(password, user.password);
      if (!matchedPassword) throw { message: "Password incorrect" };

      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({
        password: newHashedPassword,
      });

      return res.status(200).json({
        status: true,
        message: "Success change password",
        data: {
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();
