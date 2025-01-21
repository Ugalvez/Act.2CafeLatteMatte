const request = require('supertest');
const app = require('../app'); // Asegúrate de importar la app desde app.js
const Usuario = require('../models/users'); // Importar el modelo correctamente
const bcrypt = require('bcryptjs');

jest.mock('../models/users');
jest.mock('bcryptjs');

describe('POST /login', () => {
  it('should return an error for invalid credentials', async () => {
    const mockUser = {
      email: 'ugalvez@framesporsegundo.com',
      password: '$2a$12$yPZdGmFLI3.y1uAbPQdOqOqIuF8MihW3/9FvGbDh2A9FgPbMjY7R6'
    };

    Usuario.findOne.mockResolvedValue(mockUser);  // Simulamos que el usuario existe
    bcrypt.compare.mockResolvedValue(false); // Simulamos que las contraseñas no coinciden

    const response = await request(app)
      .post('/login')
      .send({ email: 'ugalvez@framesporsegundo.com', password: 'wrongpassword' });

    expect(response.status).toBe(422);
    expect(response.text).toContain('Email o password inválidos.');
  });
});