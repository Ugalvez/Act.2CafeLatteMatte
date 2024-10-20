const express = require ("express");
const app = express();

app.use((req, res, next) => {
 console.log('Estamos en el Middleware');
 next();
 });

 app.listen(3000);