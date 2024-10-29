exports.getLogin = (req, res, next) => {
    console.log(req.session.autenticado);
    res.render('../views/login', {
      path: '/login',
      titulo: 'Ingresar'
    });
  };

exports.postLogin = (req, res, next) => {
    //res.setHeader('Set-Cookie', 'autenticado=true');
    //res.setHeader('Set-Cookie', 'autenticado=true; HttpOnly');
    //res.setHeader('Set-Cookie', 'autenticado=true; HttpOnly; Secure');
    req.session.autenticado = true;
    res.redirect('/');
};