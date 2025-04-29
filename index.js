const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

// ✅ Obtener todos los empleados
app.get('/empleados/:id', async (req, res) => {
	const { id } = req.params;
  try {
    const [rows] = await pool.query(`SELECT 
    trabajos.tiempoProduccion,puestos.nombrePuesto,empleados.nombreEmpleado,empleados.apellidoEmpleado,procesos.fechaInicio,procesos.cantidadProducto,productos.nombreProducto
FROM 
    trabajos
JOIN 
	empleados ON trabajos.idEmpleado = empleados.idEmpleado
JOIN 
    puestos ON trabajos.idPuesto = puestos.idPuesto
JOIN 
    procesos ON trabajos.idProceso = procesos.idProceso
JOIN
	productos ON procesos.idProducto = productos.idProducto
WHERE
	empleados.idEmpleado = ?
`,[id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/empleados/todos', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM empleados`,);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/empleados', async (req, res) => {
  const { idEmpleado, nombreEmpleado, apellidoEmpleado,fechaIngreso } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO empleados (idEmpleado, nombreEmpleado, apellidoEmpleado,fechaIngreso) VALUES (?, ?, ?,?)',
      [idEmpleado, nombreEmpleado, apellidoEmpleado,fechaIngreso]
    );
    res.json({ idEmpleado: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/roles', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM roles');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// ✅ Insertar un nuevo empleado
app.post('/empleados', async (req, res) => {
  const { nombreEmpleado, apellidoEmpleado, idRol, fechaIngreso } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO empleados (nombreEmpleado, apellidoEmpleado, idRol, fechaIngreso) VALUES (?, ?, ?, ?)',
      [nombreEmpleado, apellidoEmpleado, idRol, fechaIngreso]
    );
    res.json({ idEmpleado: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/roles', async (req, res) => {
    const { nombreRol } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO empleados (nombreRol) VALUES (?)',
        [nombreRol]
      );
      res.json({ idRol: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
