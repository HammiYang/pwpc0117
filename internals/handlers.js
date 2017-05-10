var staticServer =require("./static-server");
var config = require("../config/config");
var mongo = require("mongodb").MongoClient;

var url = config.dbStringConnection;
console.log(`BD : ${url}`);
// var staticServer = require("./static-server");

// var mongo = require('mongodb').MongoClient;
// var url = 'mongodb://127.0.0.1:27017/Condos'
//cargando una liberia que
//permite persear la informacion
//de formularios
var querystring = require('querystring');
//Archivo que contiene los
//manejadores correspondientes
//al "api" de mi aplicacion 
var colors = require('colors');
var author = {
    "name": "Hammi Muñiz",
    "department": "Computers and Systems",
    "university": "TecNM -ITGAM"
};

//manejadores
var getAuthorInfo = function (req, res) {
    //estableciendo el mime apropiado
    //para dar a conocer al navegador
    //que se enviara un json
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    //serializar
    var jsonResponse = JSON.stringify(author);
    res.end(jsonResponse);
}

var getServerName = function (req, res) {
    console.log("Respondiendo Nombre del servidor...\n");
    res.end(`>Servidor Halcones Peregrinos`);
}

var getServerTime = function (req, res) {
    var d = new Date(),
        horas = d.getHours(),
        minutos = d.getMinutes(),
        segundos = d.getSeconds();
    hora = `${horas}:${minutos}:${segundos}`;
    console.log("Respondiendo Nombre del servidor...\n");

    if (horas >= 0 && horas < 12) {
        res.end('<body background="../img/dia.jpg" id="fondo" > <h1>' +
            '<font color="white">' + `>Buenos Dias la hora actual del server: ${hora}` + '</font>' +
            '</h1> </body>');
    }
    if (horas >= 12 && horas < 18) {
        res.end('<body background="../img/tarde.jpg" id="fondo" > <h1>' +
            '<font color="white">' + `> Buenas Tardes la hora actual del server es: ${hora}` + '</font>' +
            '</h1> </body>');
    }
    if (horas >= 18 && horas < 24) {

        res.end('<body background="../img/noche.jpg"> <h1>' +
            '<font color="white">' + `>Buenas Noches la hora actual del server es: ${hora}` + '</font>' +
            '</h1> </body>');
    }
}

var getPostRoot = function (req, res) {
    //viendo el tipo de peticion
    if (req.method === "POST") {
        //Procesar un formulario
        var postData = "";
        //create a listener
        //event driven programming
        //creando un listener ante
        //la llegada de datos
        req.on("data", function (dataChunk) {
            postData += dataChunk;//concatenacion
            //agregando seguridad al asunto
            if (postData.length > 1e6) {
                //Destruir a conexion
                console.log("> Actividad maliciosa detectada por parte de un cliente D:")
                req.connection.destroy();
            }
        });
        //registrando otro listener ante un cierre
        //de conexion
        req.on("end", function () {
            //rescatar los datos recibidos 
            //del cliente
            console.log(`>Data Received: ${postData}`.data);
            var data = querystring.parse(postData);
            //Replicar los datos recibidos
            res.writeHead(200, {
                'Content-Type': "text/html"
            });

            // var docs = data;

            // res.write(`<p> ${JSON.stringify(data)}</p>`);
            mongo.connect(url, function (err, db) {
                if (err) throw err
                var collection = db.collection('contenido')
                collection.insert(data, function (err, documents) {
                    if (err) res.write('Tu IDE se repite');
                    else {
                        res.write('<meta charset="UTF-8">');
                        res.write('Tus datos fueron correctamente insertados')
                        res.write(`<p> ${JSON.stringify(data)}</p>`);
                    }
                    db.close()
                    res.end();
                })
            })
        });
    } else {
        //se sirve el index.html
        console.log(">se solicita la raiz con Get".red);
        staticServer.serve(req, res);
    }

}

var getfind = function (req, res) {

    mongo.connect(url, function (err, db) {
        if (err) {
            return console.error(err)
        }
        //accedo a la coleccion con parrots 
        db.collection('contenido').find({}).toArray(
            function (err, documents) {
                if (err) return console.error(err);
                if (documents.length == 0)
                    res.write('No cuenta con ningun registro');
                else {
                    res.write('<P ALIGN=CENTER>');
                    res.write('<table border="1"><thead><tr><th>ID</th><th>Nombre</th><th>Apllido</th><th>Depto</th></tr></thead>');
                    for (i = 0; i < documents.length; i++) {
                        //var a = documents[i]._id, b = documents[i].Nombre, c=documents[i].Apellido,d=documents[i].Depto;
                        res.write('<tr><td>' + documents[i]._id + '</td>' +
                            '<td>' + documents[i].Nombre + '</td>' +
                            '<td>' + documents[i].Apellido + '</td>' +
                            '<td>' + documents[i].Depto + '</td></tr>')
                    }
                    res.write('</p>')
                }

                res.end();
                db.close()
            })
    })

}
//exportando Manejadores
var handlers = {};
handlers["/"] = getPostRoot;
handlers["/getauthorinfo"] = getAuthorInfo;
handlers["/getservername"] = getServerName;
handlers["/getservertime"] = getServerTime;
handlers["/getfind"] = getfind;
module.exports = handlers;