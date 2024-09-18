import UserModel from "../Models/UserModel.js";

class AuthUser {
  async verifyUser(req, res, next) {
    try {
      if (!req.session.userId)
        throw { message: "Please login to your account" };

      const user = await UserModel.findOne({
        where: {
          id: req.session.userId,
        },
      });
      if (!user) throw { message: "User not found" };

      req.userId = user.id;
      req.role = user.role;
      next();
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async adminOnly(req, res, next) {
    try {
      if (user.role !== "Admin") throw { message: "Access denied" };
      next();
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthUser();
