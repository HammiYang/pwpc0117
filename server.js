// Cargar el modulo http
var http = require('http');

// Cargar el modulo fs
var fs = require('fs');

// Cargar el modulo path  ue ayuda a administrar rutas
var path = require('path');
var colors = require('colors');

// --Cargando configuraciones
var config = require("./config/config");

// Importanto los handlers
var handlers = require("./internals/handlers");
// Importo la funcionalidad del servidor estatico
var staticserver = require('./internals/static-server');




// Establecer el metodo de colors
colors.setTheme(config.color_theme);

// Cargando el modulo mime
var mime =require ('mime');

// Creando el server
var server = http.createServer(function(req, res){
    // Logeando la peticion
    console.log(`> Peticion entrante: ${req.url}`.data);


   
    // Verificando si la url corresponde a un comando de mi API
    if(typeof(handlers[req.url]) == 'function'){
        // Existe el manejador en mi API
        // Entonces se manda a ejecutar el manejador con los parametros que pide
        handlers[req.url](req,res);
    }else{
        // No existe el manejado en mi API
        // Entonces intento servir la url como un recurso estatico
        staticserver.serve(req,res);
    }
});

// Poniendo en ejecucion el server
server.listen(config.PORT,config.IP,function(){
    console.log(`> Server escuchando en http://${config.IP}:${config.PORT}`.info)
    
})