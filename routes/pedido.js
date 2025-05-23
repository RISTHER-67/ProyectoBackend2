const express = require('express');
const router = express.Router();
const db = require('../confi/db');

router.post('/pedido', (req, res) => {
  const { usuario_id, metodo_pago, numero_operacion, productos } = req.body;

  if (!usuario_id || !metodo_pago || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ message: 'Datos incompletos o carrito vacío' });
  }

  // Insertar pedido
  db.query(
    'INSERT INTO pedidos (usuario_id, metodo_pago, numero_operacion, fecha_creacion) VALUES (?, ?, ?, NOW())',
    [usuario_id, metodo_pago, numero_operacion],
    (err, result) => {
      if (err) {
        console.error('Error al insertar pedido:', err);
        return res.status(500).json({ message: 'Error interno al registrar el pedido' });
      }

      const pedido_id = result.insertId;
      
      const insertarProductos = (index) => {
        if (index >= productos.length) {
          return res.status(200).json({ message: 'Pedido registrado correctamente' });
        }

        const producto = productos[index];
        const { id, quantity, price } = producto;

        if (!id || !quantity || !price) {
          return insertarProductos(index + 1);
        }

        db.query(
          'INSERT INTO pedidos_productos (pedido_id, productos_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [pedido_id, id, quantity, price],
          (err) => {
            if (err) {
              console.error('Error al insertar producto:', err);
              return res.status(500).json({ message: 'Error interno al registrar el pedido' });
            }

            insertarProductos(index + 1);
          }
        );
      };

      insertarProductos(0);
    }
  );
});

module.exports = router;