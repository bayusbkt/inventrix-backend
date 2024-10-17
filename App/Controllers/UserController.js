import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";

class UserController {
  async createUser(req, res) {
    try {
      const { nis, name, role, password } = req.body;

      if (!nis) throw { message: "Mohon masukkan NIS" };
      const existingUser = await UserModel.findOne({ where: { nis } });
      if (existingUser) throw { message: "NIS sudah digunakan" };

      if (!name) throw { message: "Mohon masukkan Nama" };
      if (!role) throw { message: "Mohon masukkan Role" };
      if (!password) throw { message: "Mohon masukkan Password" };

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        nis,
        name,
        role,
        password: hashPassword,
      });
      if (!user) throw { message: "Gagal membuat Pengguna" };

      return res.status(201).json({
        status: true,
        message: "Sukses membuat Pengguna",
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
      if (!password) throw { message: "Mohon masukkan Password" };
      if (!newPassword) throw { message: "Mohon masukkan Password Baru" };

      const user = await UserModel.findOne({
        where: {
          id: req.userId,
        },
      });
      if (!user) throw { message: "Pengguna tidak ditemukan" };

      const matchedPassword = await bcrypt.compare(password, user.password);
      if (!matchedPassword) throw { message: "Password salah" };

      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({
        password: newHashedPassword,
      });

      return res.status(200).json({
        status: true,
        message: "Sukses merubah Password",
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
