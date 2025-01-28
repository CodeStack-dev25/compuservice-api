import { appLogger } from "../config/loggers.config.js"

const ADMIN_CREDENTIALS = {
    username: "compuservice.2025@compuservice.com",
    password: "210674Fdf_231096Cdf"
  };

export const login = (req, res) =>{
    try {
            const { username, password } = req.body;
                      
            // Validar credenciales
            if (username === "compuservice.2025@compuservice.com" && password === "210674Fdf_231096Cdf") {
              req.session.isAuthenticated = true;
              
              return res.status(200).json({msj: 'Usuario conectado', user: 'CompuService'});
            }
            res.status(400).json({msj: 'usuario y/o contraseña incorrecta'})
    } catch (error) {
        appLogger.error('Error login', error)
    }
}

export const logout = (req, res) =>{
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).send("Ocurrió un error al cerrar la sesión");
        }
        res.status(200).send('Logout')
        
      });
}