// Pruebas de login
// Simula un registro de usuario, simula un registro de un correo en uso y simula que no haya coincidencia en las contraseñas
//Revisadas por Sergio Morillo



const request = require('supertest');
const app = require('../../app');
const bcrypt = require('bcryptjs');
const Usuario = require('../../models/users');

jest.mock('../../models/users');
jest.mock('bcryptjs');

bcrypt.hash = jest.fn();
Usuario.findOne = jest.fn();
Usuario.prototype.save = jest.fn();

describe('POST /registrarse', () => {
  it('should register a user and redirect to login', async () => {
    // Simula que no existe un usuario con ese email
    Usuario.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');  // Simula un hash de contraseña

    const response = await request(app)
      .post('/registrarse')
      .send({
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
        fechaNacimiento: '1990-05-15',
        email: 'user@example.com',
        password: 'password123',
        passwordConfirmado: 'password123',
      });

    expect(response.status).toBe(302);  // Redirección después del registro
    expect(response.header.location).toBe('/login');  // Redirige a login
    expect(Usuario.prototype.save).toHaveBeenCalled();  // Verifica que el usuario se haya guardado
  });

  it('should return error message if email is already in use', async () => {
    // Simula que el email ya está en uso
    Usuario.findOne.mockResolvedValue({ email: 'user@example.com' });

    const response = await request(app)
      .post('/registrarse')
      .send({
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
        fechaNacimiento: '1990-05-15',
        email: 'user@example.com',
        password: 'password123',
        passwordConfirmado: 'password123',
      });

    expect(response.status).toBe(422);  // Error de validación
    expect(response.text).toContain('El email ingresado ya existe');
  });

  it('should return error if passwords do not match', async () => {
    // Simula que no coinciden las contraseñas
    Usuario.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/registrarse')
      .send({
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
        fechaNacimiento: '1990-05-15',
        email: 'user@example.com',
        password: 'password123',
        passwordConfirmado: 'differentPassword',  // Contraseñas no coinciden
      });

    expect(response.status).toBe(422);  // Error de validación
    expect(response.text).toContain('Las contraseñas no coinciden');
  });

  it('should return error if email is invalid', async () => {
    // Simula un email inválido
    Usuario.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/registrarse')
      .send({
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
        fechaNacimiento: '1990-05-15',
        email: 'invalid-email',  // Email inválido
        password: 'password123',
        passwordConfirmado: 'password123',
      });

    expect(response.status).toBe(422);  // Error de validación
    expect(response.text).toContain('Por favor ingrese un email válido');
  });
});