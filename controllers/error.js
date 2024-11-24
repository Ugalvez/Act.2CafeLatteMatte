// Maneja los errores 404 (Página no encontrada)
exports.get404 = (req,res,next) =>{
       res.status(404);
       res.render('404',{
        titulo: 'Pagina No Encontrada',
        path:'',
        autenticado: req.session.autenticado});
   }

// Maneja los errores 500 (Error interno del servidor)
   exports.get500 = (req, res, next) => {
    console.log(error);
    res.status(500).render('500', {
        titulo: 'Error!',
        path: '/500',
        autenticado: req.session.autenticado
    });
};