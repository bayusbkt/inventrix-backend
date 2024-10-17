import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";

class AuthControllers {

  async login(req, res) {
    try {
      const { nis, password } = req.body;
      if (!nis) throw { message: "Mohon masukkan NIS" };
      if (!password) throw { message: "Mohon masukkan Password" };

      const user = await UserModel.findOne({ where: { nis } });
      if (!user) throw { message: "Pengguna tidak ditemukan" };

      const matchedPassword = await bcrypt.compare(password, user.password);
      if (!matchedPassword) throw { message: "Password salah" };

      //Memasukkan ID dari user ke SESSION
      req.session.userId = user.id;

      const userInfo = {
        id: user.id,
        nis: user.nis,
        name: user.name,
        role: user.role,
      };

      return res.status(200).json({
        status: true,
        message: "Login Berhasil",
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
          message: "Tidak ada Session aktif, mohon Login ulang!",
        });
      }

      req.session.destroy((error) => {
        if (error)
          res.status(400).json({
            status: false,
            message: "Logout Gagal",
          });
      });

      res.clearCookie("connect.sid");
      return res.status(200).json({
        status: true,
        message: "Logout Berhasil",
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
