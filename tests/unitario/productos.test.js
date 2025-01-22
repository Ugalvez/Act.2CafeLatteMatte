//pruebas unitarias de productos - Ulysses Galvez

const request = require('supertest');
const mongoose = require('mongoose');
const Producto = require('../../models/producto');
const app = require('../../app');

// Conexión a la base de datos de prueba
beforeAll(async () => {
  await mongoose.connect('mongodb+srv://ugalvez987:sfpa4774@cluster0.b1vsq.mongodb.net/pruebasCafe?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  // Limpia los productos después de cada prueba
  await Producto.deleteMany({});
});

afterAll(async () => {
  // Desconecta la base de datos después de todas las pruebas
  await mongoose.disconnect();
});

describe('Pruebas de las rutas de productos', () => {
  it('Debería listar todos los productos (GET /productos)', async () => {
    await Producto.create([
      { nombre: 'Producto 1', precio: 100, descripcion: 'Descripción 1', urlImagen: 'imagen1.jpg' },
      { nombre: 'Producto 2', precio: 200, descripcion: 'Descripción 2', urlImagen: 'imagen2.jpg' },
    ]);

    // Realiza la solicitud GET
    const response = await request(app).get('/productos');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBe(2);
    expect(response.body[0].nombre).toBe('Producto 1');
  });

  it('Debería obtener un producto por su ID (GET /productos/:id)', async () => {
    const producto = await Producto.create({
      nombre: 'Producto 1',
      precio: 100,
      descripcion: 'Descripción 1',
      urlImagen: 'imagen1.jpg',
    });

    const response = await request(app).get(`/productos/${producto._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.nombre).toBe('Producto 1');
  });

  it('Debería manejar errores al buscar un producto inexistente (GET /productos/:id)', async () => {
    const idInexistente = new mongoose.Types.ObjectId();

    // Realiza la solicitud GET con un ID inexistente
    const response = await request(app).get(`/productos/${idInexistente}`);
    expect(response.status).toBe(302);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe(undefined);
  });
});
