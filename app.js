const express = require('express');
const { sequelize, CI, CI_Cambios, Relaciones } = require('./model');
const bodyParser = require('body-parser');
const { Op, Sequelize } = require('sequelize');

const app = express();
app.use(bodyParser.json());


sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Database synchronized successfully'))
  .catch(err => console.log('Error: ' + err));

// ------------------- RUTAS -------------------

// POST: Crear un nuevo CI
app.post('/crear', async (req, res) => {
  const {
    nombre_ci, tipo_ci, descripcion, numero_serie, version,
    Fecha_adquisicion, Estado, propietario, Fecha_cambio, descripcion_cambio,
    documentacion, enlaces_incidentes, niveles_seguridad, cumplimiento,
    numero_licencia, fecha_vencimiento, ambiente
  } = req.body;

  if (!['DEV', 'QA', 'PROD'].includes(ambiente)) {
    return res.status(400).json({ message: 'Ambiente no válido. Debe ser DEV, QA o PROD.' });
  }

  try {
    const ci = await CI.create({
      nombre_ci, tipo_ci, descripcion, numero_serie, version,
      Fecha_adquisicion, Estado, propietario, Fecha_cambio, descripcion_cambio,
      documentacion, enlaces_incidentes, niveles_seguridad, cumplimiento,
      numero_licencia, fecha_vencimiento, ambiente
    });
    res.status(201).json(ci);
  } catch (error) {
    res.status(500).json({ message: 'Error creating CI', error: error.message });
  }
});

// GET: Obtener un CI por ID
app.get('/consultar/:id', async (req, res) => {
  try {
    const ci = await CI.findByPk(req.params.id);
    if (!ci) return res.status(404).json({ message: 'CI not found' });
    res.json(ci);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CI', error: error.message });
  }
});

// PUT: Actualizar CI
app.put('/actualizar/:id', async (req, res) => {
  const {
    nombre_ci, tipo_ci, descripcion, numero_serie, version,
    Fecha_adquisicion, Estado, propietario, Fecha_cambio, descripcion_cambio,
    documentacion, enlaces_incidentes, niveles_seguridad, cumplimiento,
    numero_licencia, fecha_vencimiento, ambiente
  } = req.body;

  if (!['DEV', 'QA', 'PROD'].includes(ambiente)) {
    return res.status(400).json({ message: 'Ambiente no válido. Debe ser DEV, QA o PROD.' });
  }

  try {
    const ci = await CI.findByPk(req.params.id);
    if (!ci) return res.status(404).json({ message: 'CI not found' });

    await CI_Cambios.create({
      ci_id: ci.id,
      fecha_cambio: new Date(),
      descripcion_cambio: descripcion_cambio || 'Cambio no especificado'
    });

    await ci.update({
      nombre_ci, tipo_ci, descripcion, numero_serie, version,
      Fecha_adquisicion, Estado, propietario, Fecha_cambio, descripcion_cambio,
      documentacion, enlaces_incidentes, niveles_seguridad, cumplimiento,
      numero_licencia, fecha_vencimiento, ambiente
    });

    res.json(ci);
  } catch (error) {
    res.status(500).json({ message: 'Error updating CI', error: error.message });
  }
});

// DELETE: Eliminar un CI
app.delete('/eliminar/:id', async (req, res) => {
  try {
    const ci = await CI.findByPk(req.params.id);
    if (!ci) return res.status(404).json({ message: 'CI not found' });
    await ci.destroy();
    res.json({ message: 'CI deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting CI', error: error.message });
  }
});

// GET: Todos los CIs
app.get('/todos', async (req, res) => {
  try {
    const cis = await CI.findAll();
    res.json(cis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CIs', error: error.message });
  }
});

// POST: Crear relación
app.post('/crear-relacion', async (req, res) => {
  const { ci_id_origen, ci_id_destino, tipo_relacion } = req.body;
  try {
    const origen = await CI.findByPk(ci_id_origen);
    const destino = await CI.findByPk(ci_id_destino);
    if (!origen || !destino) return res.status(404).json({ message: 'One or both CIs not found' });

    const nuevaRelacion = await Relaciones.create({ ci_id_origen, ci_id_destino, tipo_relacion });
    res.status(201).json(nuevaRelacion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating relationship', error: error.message });
  }
});

// GET: Relaciones por CI
app.get('/ci/:id/relaciones', async (req, res) => {
  try {
    const relaciones = await Relaciones.findAll({
      where: {
        [Op.or]: [{ ci_id_origen: req.params.id }, { ci_id_destino: req.params.id }]
      }
    });
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching relationships', error: error.message });
  }
});



// GET: Buscar CI con filtros
app.get('/buscar', async (req, res) => {
  const { nombre_ci, tipo_ci, estado, fecha_adquisicion, ambiente } = req.query;
  const filters = {};
  if (nombre_ci) filters.nombre_ci = { [Sequelize.Op.like]: `%${nombre_ci}%` };
  if (tipo_ci) filters.tipo_ci = tipo_ci;
  if (estado) filters.Estado = estado;
  if (fecha_adquisicion) filters.Fecha_adquisicion = fecha_adquisicion;
  if (ambiente) filters.ambiente = ambiente;

  try {
    const cis = await CI.findAll({ where: filters });
    if (!cis.length) return res.status(404).json({ message: 'No CI found with the given filters' });
    res.json(cis);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for CIs', error: error.message });
  }
});

module.exports = app;
