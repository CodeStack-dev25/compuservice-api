export const queryMail = (user) => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta de Cliente</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
        <div style="background-color: rgb(68, 68, 179); color: white; padding: 10px 15px; text-align: center;">
            <h1 style="margin: 0;">Consulta de Cliente</h1>
        </div>
        <div style="padding: 20px;">
            <h2 style="margin-top: 0; color: rgb(68, 68, 179);">Detalles de la Consulta</h2>
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${user?.name || "No especificado"}</p>
            <p style="margin: 10px 0;"><strong>Correo:</strong> ${user?.email || "No especificado"}</p>
            <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${user?.phone || "No especificado"}</p>
            <p style="margin: 10px 0;"><strong>Consulta:</strong></p>
            <p style="margin: 10px 0;">${user?.query || "No especificada"}</p>
        </div>
        <div style="background-color: #f1f1f1; padding: 10px 15px; text-align: end; font-size: 12px; color: #555;">
            <p style="margin: 0;">CompuService</p>
        </div>
    </div>
</body>
</html>
    `;
};
