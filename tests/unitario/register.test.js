const { postRegistrarse } = require('../../controllers/auth');
const Usuario = require('../../models/users');
const bcrypt = require('bcryptjs');

jest.mock('../../models/users');
jest.mock('bcryptjs');

describe('Auth Controller - Register', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        nombre: 'Test',
        apellidoPaterno: 'User',
        apellidoMaterno: 'Example',
        email: 'test@test.com',
        password: '12345',
        passwordConfirmado: '12345'
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

  it('should render the register page with validation errors if inputs are invalid', async () => {
    req.body.email = ''; // Invalid email
    const errors = [{ msg: 'Email es inválido.' }];
    const mockValidationResult = { isEmpty: () => false, array: () => errors };
    jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue(mockValidationResult);

    await postRegistrarse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.render).toHaveBeenCalledWith('auth/registrarse', expect.objectContaining({
      mensajeError: 'Email es inválido.',
    }));
  });

  it('should save a new user and redirect to login', async () => {
    const mockValidationResult = { isEmpty: () => true, array: () => [] };
    jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue(mockValidationResult);

    bcrypt.hash.mockResolvedValue('hashedPassword');
    Usuario.prototype.save = jest.fn().mockResolvedValue(true);

    await postRegistrarse(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith('12345', 13);
    expect(Usuario.prototype.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });
});