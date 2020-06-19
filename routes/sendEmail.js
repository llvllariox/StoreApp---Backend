var env = require('node-env-file'); // .env file
env('./.env.dist');
console.log(__dirname);

var express = require('express');
var app = express();
const nodemailer = require("nodemailer");
var logger = require('../utils/logger');


// Rutas
app.post('/', (req, res, next) => {

    var body = req.body;
    var nombre = body.nombre;
    var email = body.email;
    var telefono = body.telefono;
    var mensaje = body.mensaje;
    var tipo = body.tipo;
    var tls

    if (process.env.EMAIL_TLS == 'false') {
        tls = false
    } else {
        tls = true
    }

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_PASSWORD, // generated ethereal password
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: tls
            }
        });

        if (tipo = 1) {
            template = {
                from: 'contacto@ausa-store.com', // sender address
                to: `contacto@ausa-store.com, ${email}`, // list of receivers
                subject: "Ingreso Consulta WEB", // Subject line
                // text: mensaje, // plain text body
                html: `<p><b> Tu consulta ha sido ingresada exitosamente. </b></p>
                       <hr>   
                       <p><b>Nombre: </b> ${nombre}</p>
                       <p><b>Email: </b> ${email}</p>
                       <p><b>Telefono: </b> ${telefono}</p>
                       <p><b>Mensaje: </b> ${mensaje}</p>
                       <hr>
                       <p><i> Nos pondremos en contacto contigo a la brevedad. </i></p>`, // html body
            }
        }

        if (tipo = 2) {
            var link = body.link;
            template = {
                from: 'contacto@ausa-store.com', // sender address
                to: `contacto@ausa-store.com, ${email}`, // list of receivers
                subject: "Confirmacion correo Electronico", // Subject line
                // text: mensaje, // plain text body
                html: `<p><b></b></p>
                       <hr>   
                       <p><b>Estimad@: </b> ${nombre}</p>
                       <p><b>Favor activa tu cuenta en el siguiente link:</b></p>
                       <p>${link}</p>
                       <hr>
                       <p></p>`, // html body
            }
        }

        // send mail with defined transport object
        let info = await transporter.sendMail(template)
            .then(
                resp => {
                    logger.info('Envio Email', { route: `/sendEmail`, method: 'POST', object: { nombre, email, telefono, mensaje } });
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Peticion realizada correctamente',
                        resp: resp
                    });
                }

            ).catch(
                err => {
                    logger.error('Envio Email', { route: `/sendEmail`, method: 'POST', object: { nombre, email, telefono, mensaje }, error: err });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error el enviar email',
                        errors: err
                    });
                }
            )

    }

    main().catch(console.error);
});


module.exports = app;