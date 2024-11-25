// Para verificar si el usuario está autenticadom

module.exports = (req, res, next) => {
    if (!req.session.autenticado) {
        return res.redirect('/login');
    }
    next();
}