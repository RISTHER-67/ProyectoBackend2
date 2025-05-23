const express = require('express');
const router = express.Router();
const db = require('../confi/db');

// Middleware de autenticación (ajusta según tu sistema)
function isAuthenticated(req, res, next) {
    // Aquí deberías validar la sesión o token del usuario
    // Por simplicidad, asumimos que usuario_id viene en query o body
    if (req.body.usuario_id || req.query.usuario_id) {
        return next();
    }
    res.status(401).json({ message: 'No autenticado' });
}

router.get('/user', isAuthenticated, (req, res) => {
    const usuario_id = req.query.usuario_id || req.body.usuario_id;

    db.query('SELECT usuario_id, nombre_usuario, correo FROM usuarios WHERE usuario_id = ?', [usuario_id], (err, user) => {
        if (err) {
            console.error('Error al consultar usuario:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            message: "Usuario encontrado exitosamente",
            usuario: {
                usuario_id: user[0].usuario_id,
                nombre_usuario: user[0].nombre_usuario,
                correo: user[0].correo
            }
        });
    });
});

module.exports = router;