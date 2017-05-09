// Funcionalidad de servidor estatico
var fs = require('fs'),
    mime = require('mime'),
    path = require('path'),
    colors = require('colors'),
    config = require('../config/config');

// Exportando funcionalidad de servidor estatico
exports.serve = function (req, res) {
    // Variable que almacenara la ruta absoluta 
    // del archivo a ser servido
    var resourcePath;
    if (req.url == "/") {
        // El cliente no especifica recurso
        resourcePath = path.resolve('./static/index.html');
    } else {
        // Obteniendo la ruta absoluta del recurso que se desea servir
        resourcePath =
            path.resolve(config.STATIC_PATH + req.url);
    }
    console.log(`> Recurso solicitado: ${resourcePath}`.data);


    // Extrayendo la extension de la url
    var extName = path.extname(resourcePath);

    // Creando la variable conten-type
    var contentType = mime.lookup(extName);
    // todo: verificar la existencia del recurso
    fs.exists(resourcePath, function (exists) {
        if (exists) {
            console.log('> El recurso existe...'.info);


            //El recurso existe y se intentará leer
            fs.readFile(resourcePath, function (err, content) {
                // Verifica si hubo un error en la lectura del archivo
                if (err) {
                    console.log('> Error en la lectura del recurso...'.error);

                    // Hubo un error de lectura
                    res.writeHead(500, {
                        'content-Type': 'html'
                    });
                    res.end('<body background="../img/error.jpg"> <h1>');
                } else {
                    console.log(`> Se despacha recurso: ${resourcePath}`.info);

                    // Hubo error de lectura
                    // Se envia el contenido al cliente
                    res.writeHead(200, {
                        'Content-Type': contentType,
                        'Server': 'ITGAM@.0.1'
                    });
                    res.end(content, 'utf-8');
                }
            });
        } else {4
            // El recurso no existe
            console.log('El recurso solicitado no fue encontrado...'.info);
            res.writeHead(400, {
                'Content-type': 'text/html',
                'server': 'ITGAM@.0.1'

            });
            res.end(
                '<body background="../img/404.jpg"> <h1 align="center">');
        }
    });
}
