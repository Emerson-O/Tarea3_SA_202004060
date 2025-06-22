const request = require('supertest');
const app = require('../app');  // app.js debe exportar express()
const { sequelize, CI } = require('../model');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Pruebas de los Endpoints de CI', () => {
  it('debería crear un nuevo CI', async () => {
    const newCI = {
      nombre_ci: 'Servidor1',
      tipo_ci: 'servidor',
      descripcion: 'Servidor de aplicaciones',
      ambiente: 'PROD'
    };

    const response = await request(app)
      .post('/crear')
      .send(newCI)
      .expect(201);

    expect(response.body.nombre_ci).toBe(newCI.nombre_ci);
  });

  it('debería obtener un CI por ID', async () => {
    const newCI = await CI.create({
      nombre_ci: 'Servidor2',
      tipo_ci: 'servidor',
      descripcion: 'Servidor para base de datos',
      ambiente: 'DEV'
    });

    const response = await request(app)
      .get(`/consultar/${newCI.id}`)
      .expect(200);

    expect(response.body.id).toBe(newCI.id);
    expect(response.body.nombre_ci).toBe(newCI.nombre_ci);
  });

  it('debería actualizar un CI existente', async () => {
    const ci = await CI.create({
      nombre_ci: 'Servidor3',
      tipo_ci: 'servidor',
      descripcion: 'Servidor viejo',
      ambiente: 'QA'
    });

    const updatedData = {
      nombre_ci: 'Servidor3-Modificado',
      tipo_ci: 'servidor',
      descripcion: 'Servidor actualizado',
      ambiente: 'QA'
    };

    const response = await request(app)
      .put(`/actualizar/${ci.id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.nombre_ci).toBe(updatedData.nombre_ci);
  });

  it('debería eliminar un CI', async () => {
    const ci = await CI.create({
      nombre_ci: 'Servidor4',
      tipo_ci: 'servidor',
      descripcion: 'Servidor para eliminar',
      ambiente: 'DEV'
    });

    await request(app)
      .delete(`/eliminar/${ci.id}`)
      .expect(200);

    const check = await CI.findByPk(ci.id);
    expect(check).toBeNull();
  });
});
