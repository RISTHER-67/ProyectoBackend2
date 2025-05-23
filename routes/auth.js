const express = require('express');
const router = express.Router();
const db = require('../confi/db');
const bcrypt = require('bcrypt');

// Registro usuario
router.post('/register', (req, res) => {
    const { nombre_usuario, correo, contraseña, telefono } = req.body;

    // Validación básica
    if (!nombre_usuario || !correo || !contraseña || !telefono) {
        return res.status(400).send('Faltan datos obligatorios');
    }

    // Hash de la contraseña
    bcrypt.hash(contraseña, 10, (err, hash) => {
        if (err) {
            console.error('Error al hashear contraseña:', err);
            return res.status(500).send('Error interno');
        }

        const fecha = new Date();
        const query = `INSERT INTO usuarios (nombre_usuario, correo, telefono, contraseña, fecha_registro)
        VALUES (?, ?, ?, ?, ?)`;

        // Consulta a la base de datos
        db.query(query, [nombre_usuario, correo, telefono, hash, fecha], (err, result) => {
            if (err) {
                console.error('Error al registrar:', err);
                return res.status(500).send('Error interno');
            }
            
            res.status(200).send('Usuario registrado exitosamente');
        });
    });
});

module.exports = router;