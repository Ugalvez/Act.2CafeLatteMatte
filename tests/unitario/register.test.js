// Pruebas de login
// Simula que el email sea correcto y que el registro se haya realizado exitosamente
//Revisadas por Sergio Morillo


const { postRegistrarse } = require('../../controllers/auth');
const Usuario = require('../../models/users');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

jest.mock('../../models/users');
jest.mock('bcryptjs');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Auth Controller - Register', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        nombre: 'Test',
        apellidoPaterno: 'User',
        apellidoMaterno: 'Example',
        email: 'ugalvez987@hotmail.com',
        password: 'asdf1234',
        passwordConfirmado: 'asdf1234',
      },
      session: { usuario: null },
    };
    res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      render: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should render the register page with validation errors if inputs are invalid', async () => {
    // Test de validacion de email
    const errors = [{ msg: 'Email es inválido.' }];
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    await postRegistrarse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.render).toHaveBeenCalledWith('auth/registrarse', expect.objectContaining({
      mensajeError: 'Email es inválido.',
    }));
  });

  it('should save a new user and redirect to login', async () => {
    //Test de registro exitoso
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    bcrypt.hash.mockResolvedValue('hashedPassword');
    Usuario.prototype.save = jest.fn().mockResolvedValue(true);

    await postRegistrarse(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith('asdf1234', 13);
    expect(Usuario.prototype.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });
});