import { handleSuccess, handleErrorClient } from "../Handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/User.entity.js";
import bcrypt from "bcrypt";
import { userBodyValidation } from "../validations/user.validations.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID extraído del token JWT
    const { email, password } = req.body;

    const { error } = userBodyValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar solo los campos proporcionados
    if (email) user.email = email;
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await userRepository.save(user);

    res.json({
      message: "Perfil actualizado exitosamente",
      user: {
        id: user.id,
        username: user.username,  
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID extraído del token JWT

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await userRepository.remove(user);

    res.json({ message: "Cuenta eliminada exitosamente" });

  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};