//Pruebas unitarias de Admin - Ulysses Galvez

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

    it('Debería eliminar un producto existente (POST /eliminar-producto)', async () => {
        const producto = await Producto.create({
          nombre: 'Producto 1',
          precio: 100,
          descripcion: 'Descripción 1',
          urlImagen: 'imagen1.jpg',
          categoria: 'café',
          idUsuario: new mongoose.Types.ObjectId(),
          stock: '99',
        });

        const adminUsuario = {
          usuario: {
            nombre: 'admin',
            apellidoPaterno: 'ejemplo',
            apellidoMaterno: 'ejemplo2',
            email: 'ejemplo@prueba.com',
            password: 'asdfasd',
            rol: 'administrador',
            _id: new mongoose.Types.ObjectId(),
          }
        };

        const response = await request(app)
          .post('/eliminar-producto')
          .set('Cookie', [`usuario=${JSON.stringify(adminUsuario)}`])  // Configura la cookie con la sesión simulada
          .send({ idProducto: producto._id });
    
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/adminHome');
    
        // Verifica que el producto ya no existe
        const productoEliminado = await Producto.findById(producto._id);
        expect(productoEliminado).toBeNull();
    });
    
});
