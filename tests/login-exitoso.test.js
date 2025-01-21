const request = require('supertest');
const app = require('../app'); // Asegúrate de que tu app de Express esté exportada
const Usuario = require('../models/users');
const bcrypt = require('bcryptjs');

jest.mock('../models/users'); // Simulamos el modelo Usuario para evitar interactuar con la base de datos real
jest.mock('bcryptjs'); // Simulamos bcrypt para controlar la comparación de contraseñas

describe('POST /login', () => {
  it('should log in successfully with correct credentials', async () => {
    // Usuario tipo cliente
    const mockUser = {
      email: 'ugalvez@framesporsegundo.com',
      password: '$2a$12$yPZdGmFLI3.y1uAbPQdOqOqIuF8MihW3/9FvGbDh2A9FgPbMjY7R6' // Contraseña cifrada (ejemplo: "asdf1234")
    };

    Usuario.findOne.mockResolvedValue(mockUser); // Simulamos que el usuario existe
    bcrypt.compare.mockResolvedValue(true); // Simulamos que las contraseñas coinciden

    const response = await request(app)
      .post('/login')
      .send({ email: 'ugalvez@framesporsegundo.com', password: 'asdf1234' });

    expect(response.status).toBe(302); // Redirección exitosa
    expect(response.headers.location).toBe('/'); // Redirige al inicio
  });
});