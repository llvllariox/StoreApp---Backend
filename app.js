var env = require('node-env-file'); // .env file
env(__dirname + '/.env.dist');

// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('./utils/logger');
var fs;
var http;
var https;
var privateKey;
var certificate;
var ca;
var credentials;

if (process.env.ENV == 'AWS') {

    // AWS -- Dependencies
    fs = require('fs');
    http = require('http');
    https = require('https');


    // AWS -- Certificate SSL
    privateKey = fs.readFileSync('/etc/letsencrypt/live/ausa-store.com/privkey.pem', 'utf8');
    certificate = fs.readFileSync('/etc/letsencrypt/live/ausa-store.com/cert.pem', 'utf8');
    ca = fs.readFileSync('/etc/letsencrypt/live/ausa-store.com/chain.pem', 'utf8');

    // AWS -- Credentials
    credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
}


//PORT
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
var sendEmailRoutes = require('./routes/sendEmail');
var pedidoRoutes = require('./routes/pedido');

if (process.env.ENV == 'AWS') {
    // AWS -- Conexion BD Localhost EC2
    mongoose.connection.openUri(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`, (err, res) => {
        if (err) throw err;
        console.log('Base de Datos puerto 27017: \x1b[32m%s\x1b[0m', 'Online');
    });
} else {

    //Conexion BD atlas con usuario userReadWrite 
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    console.log(uri);
    mongoose.connect(uri, (err, res) => {
        if (err) throw err;
        logger.info('Base de Datos Mongo Atlas: Online', { respuesta: 'OK' });
        console.log('Base de Datos Mongo Atlas: \x1b[32m%s\x1b[0m', 'Online');
    });
}

//Rutas la principal va al final.
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/producto', productoRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/sendEmail', sendEmailRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/', appRoutes);

if (process.env.ENV == 'AWS') {
    // AWS -- Starting both http & https servers
    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    // AWS --  HTTP
    httpServer.listen(3010, () => {
        console.log('HTTP Server running on port 3010');
    });
    // AWS -- HTTPS
    httpsServer.listen(port, () => {
        console.log('HTTPS Server running on port 3000');
    });
} else {

    // Escuchar peticiones Local
    app.listen(port, () => {
        logger.info(`Express Server puerto ${port}: Online`, { respuesta: 'OK' });
        console.log(`Express Server puerto ${port}: \x1b[32m%s\x1b[0m`, 'Online');
    });

}