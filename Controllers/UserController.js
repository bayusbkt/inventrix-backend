import UserModel from "../Models/UserModel";

class UserController {
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

      await bcrypt.hash(newPassword, 10);

      return res.status(200).json({
        status: true,
        message: "Success change password",
        data: {
            name: user.name,
            role: user.role
        }
      })

    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();
