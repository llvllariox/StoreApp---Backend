var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


//---------------------------------------------------
//Login normal
//---------------------------------------------------

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear Token por que el usuario es valido.
        usuarioBD.password = ':)'
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }) //4horas
        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            id: usuarioBD._id,
            token: token
        });
    })

});

module.exports = app;