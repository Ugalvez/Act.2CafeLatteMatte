module.exports = (req, res, next) => {
    
    const esAdmin = req.session.usuario && req.session.usuario.rol === 'administrador';

    if (!esAdmin) {
        return res.redirect('/');
    }
    next();
}