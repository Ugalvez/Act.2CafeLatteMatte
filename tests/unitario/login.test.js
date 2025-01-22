// Pruebas de login
// Simula un usuario exista, una redireccion tras login y contraseña incorrecta
//Revisadas por Sergio Morillo

const { postLogin } = require('../../controllers/auth');
const Usuario = require('../../models/users');
const bcrypt = require('bcryptjs');

jest.mock('../../models/users');
jest.mock('bcryptjs');

describe('Auth Controller - Login', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: { email: 'ugalvez@framesporsegundo.com', password: 'asdf1234' },
      session: {
        save: jest.fn((cb) => cb && cb()), // Mock de session.save
      },
      flash: jest.fn().mockReturnValue([]),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      render: jest.fn(),
      redirect: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should render login page with error if user not found', async () => {
    // Prueba que revisa que el usuario exista
    Usuario.findOne.mockResolvedValue(null);

    await postLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.render).toHaveBeenCalledWith('auth/login', expect.objectContaining({
      mensajeError: 'Email o password inválidos.',
    }));
  });

  it('should redirect to home if login is successful', async () => {
    //Prueba de la redireccion al index despues del login exitoso
    const mockUser = { password: 'hashedPassword', _id: 'userId' };
    Usuario.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    await postLogin(req, res, next);

    expect(req.session.save).toHaveBeenCalled();
    expect(req.session.autenticado).toBe(true);
    expect(req.session.usuario).toEqual(mockUser);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('should redirect back to login with error if password is incorrect', async () => {
    //Prueba de contraseña incorrecta
    const mockUser = { password: 'hashedPassword', _id: 'userId' };
    Usuario.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await postLogin(req, res, next);

    expect(req.flash).toHaveBeenCalledWith('error', 'Email o password inválidos.');
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });
});