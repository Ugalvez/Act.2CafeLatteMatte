module.exports = (req, res, next) => {
    if (!req.session.autenticado) {
        return res.redirect('/login');
    }
    next();
}