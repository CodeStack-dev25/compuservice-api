import { appLogger } from "../config/loggers.config.js"

export const login = (req, res) =>{
    try {
            const { username, password } = req.body;
                      
            // Validar credenciales
            if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
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