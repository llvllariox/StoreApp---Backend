var express = require('express');
var app = express();
// var Hospital = require('../models/hospital');
// var Medico = require('../models/medico');
var Usuario = require('../models/usuario');



//-----------------------------------------------
//busqueda en tabla especifica
//-----------------------------------------------
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    //Expresion regular para buscar en tabla, ademas la i es para case sentitive
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex)
            break;
            // case 'medicos':
            //     promesa = buscarMedicos(busqueda, regex)
            //     break;
            // case 'hospitales':
            //     promesa = buscarHospitales(busqueda, regex)
            //     break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Coleccion incorrecta',
                error: { message: 'Coleccion no valida' }
            });
    }

    //
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data //[] las llaves para que variable de objeto conmutada , para que tome el valor no la palabra
        });
    });
});


//-----------------------------------------------
// Busqueda en todas las tablas
//-----------------------------------------------
app.get('/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    //Expresion regular para buscar en tabla, ademas la i es para case sentitive
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            // buscarMedicos(busqueda, regex),
            // buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                // medicos: respuestas[1],
                // usuarios: respuestas[2]
            });
        });
});

// function buscarHospitales(busqueda, regex) {

//     return new Promise((resolve, reject) => {

//         Hospital.find({ nombre: regex })
//             .populate('usuario', 'nombre, email')
//             .exec((err, hospitales) => {

//                 if (err) {
//                     reject('Error al buscar en Hospitales', err);
//                 } else {
//                     resolve(hospitales);
//                 }
//             });
//     });
// }

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([
                { nombre: regex },
                { email: regex }
            ])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar en usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

// function buscarMedicos(busqueda, regex) {

//     return new Promise((resolve, reject) => {

//         Medico.find({ nombre: regex })
//             .populate('usuario', 'nombre email')
//             .populate('hospital')
//             .exec((err, medicos) => {

//                 if (err) {
//                     reject('Error al buscar en medicos', err);
//                 } else {
//                     resolve(medicos);
//                 }
//             });

//     });
// }



module.exports = app;