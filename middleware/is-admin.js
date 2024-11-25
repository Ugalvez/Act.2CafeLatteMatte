// Para verificar si el usuario tiene rol de administrador

module.exports = (req, res, next) => {
    
    const esAdmin = req.session.usuario && req.session.usuario.rol === 'administrador';

    if (!esAdmin) {
        return res.redirect('/');
    }
    next();
}