// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('./utils/logger');

// //Winston logger
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     defaultMeta: { service: 'user-service' },
//     transports: [
//         //
//         // - Write to all logs with level `info` and below to `combined.log` 
//         // - Write all logs error (and below) to `error.log`.
//         //
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });

//Heroku
const port = process.env.PORT || 3000;
//Inicializar variables
var app = express();

//MiddleWare CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var productoRoutes = require('./routes/producto');
var categoriaRoutes = require('./routes/categoria');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//Conexion BD localhost en AWS
// mongoose.connection.openUri('mongodb://userReadWrite:af29101988@localhost/StoreApp', (err, res) => {
//     if (err) throw err;
//     console.log('Base de Datos puerto 27017: \x1b[32m%s\x1b[0m', 'Online');
// });


//Conexion BD atlas con usuario userReadWrite 
const uri = "mongodb+srv://userReadWrite:af29101988@hospitadb-uewzz.mongodb.net/StoreApp?retryWrites=true&w=majority";

mongoose.connect(uri, (err, res) => {
    if (err) throw err;
    logger.info('Base de Datos Mongo Atlas: Online');
    // logger.info('Base de Datos Mongo Atlas: \x1b[32m%s\x1b[0m', 'Online');
});

//Rutas la principal va al final.
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/producto', productoRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(port, () => {
    logger.info(`Express Server puerto ${port}: Online`);
    // logger.info(`Express Server puerto ${port}: \x1b[32m%s\x1b[0m`, 'Online');
})