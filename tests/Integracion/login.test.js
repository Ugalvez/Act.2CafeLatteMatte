// Pruebas de login
// Simula un login correcto, un login incorrecto y el mensaje de error
//Revisadas por Sergio Morillo

const request = require('supertest');
const app = require('../../app');
const bcrypt = require('bcryptjs');
const Usuario = require('../../models/users');

jest.mock('../../models/users');
jest.mock('bcryptjs');

bcrypt.compare = jest.fn();
Usuario.findOne = jest.fn();

describe('POST /login', () => {
  it('should redirect to home if login is successful', async () => {
    // Simula un usuario encontrado y contraseñas correctas
    Usuario.findOne.mockResolvedValue({
      _id: 'user-id',
      email: 'user@example.com',
      password: 'hashedPassword',
    });
    bcrypt.compare.mockResolvedValue(true); // Contraseñas correctas

    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(302); // Redirección
    expect(response.header.location).toBe('/'); // Redirige a la página de inicio
  });

  it('should return error message if email is not found', async () => {
    // Simula un usuario no encontrado
    Usuario.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(422); // Error de validación
    expect(response.text).toContain('Email o password inválidos');
  });

  it('should return error message if password is incorrect', async () => {
    // Simula un usuario encontrado pero con contraseña incorrecta
    Usuario.findOne.mockResolvedValue({
      _id: 'user-id',
      email: 'user@example.com',
      password: 'hashedPassword',
    });
    bcrypt.compare.mockResolvedValue(false); // Contraseña incorrecta

    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(422); // Error de validación
    expect(response.text).toContain('Email o password inválidos');
  });
});