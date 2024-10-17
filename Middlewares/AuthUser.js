import UserModel from "../Models/UserModel.js";

class AuthUser {
  async verifyUser(req, res, next) {
    try {
      if (!req.session.userId)
        throw { message: "Mohon Login terlebih dahulu" };

      const user = await UserModel.findOne({
        where: {
          id: req.session.userId,
        },
      });
      if (!user) throw { message: "Pengguna tidak ditemukan" };

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
      if (req.role !== "Admin") throw { message: "Akses ditolak" };
      next();
    } catch (error) {
      res.status(403).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthUser();
