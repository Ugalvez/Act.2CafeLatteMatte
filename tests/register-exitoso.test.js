// Importaciones necesarias
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app'); // Asegúrate de que la ruta sea correcta
const Usuario = require('../models/users'); // Asegúrate de que la ruta sea correcta

// Mock de bcrypt y Usuario
jest.mock('bcryptjs');
jest.mock('../models/users');

describe('POST /registrarse', () => {
  it('should register a new user', async () => {
    // Simulamos que no hay un usuario con ese email
    Usuario.findOne.mockResolvedValue(null);

    // Simulamos que la contraseña se cifra correctamente
    bcrypt.hash.mockResolvedValue('$2a$12$yPZdGmFLI3.y1uAbPQdOqOqIuF8MihW3/9FvGbDh2A9FgPbMjY7R6'); // Contraseña cifrada

    const response = await request(app)
      .post('/registrarse')
      .send({ email: 'nuevo@usuario.com', password: 'asdf1234' });

    expect(response.status).toBe(201); // El usuario fue creado exitosamente
    expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
  });
});