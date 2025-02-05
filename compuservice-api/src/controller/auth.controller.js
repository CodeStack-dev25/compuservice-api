import { appLogger } from "../config/loggers.config.js";

export const login = (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASS
    ) {
      req.session.isAuthenticated = true;
      appLogger.info("Usuario conectado correctamente");
      return res
        .status(200)
        .json({ msj: "Usuario conectado", user: "CompuService" });
    }
    appLogger.error(
      "Error al conectar usuario, usuario y/o contraseña incorrecta"
    );
    res.status(400).json({ msj: "usuario y/o contraseña incorrecta" });
  } catch (error) {
    appLogger.error("Error al iniciar sesión", error);
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      appLogger.error("Error al cerrar sesión");
      return res.status(500).send("Ocurrió un error al cerrar la sesión");
    }
    appLogger.info("Sesión cerrada correctamente");
    res.status(200).send("Logout");
  });
};
