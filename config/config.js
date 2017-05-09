//exporta el objeto module.exports
module.exports = {
   //"IP":'127.0.0.1' || process.env.IP,
    //"IP": process.env.IP || '127.0.0.1',
   "IP": process.env.IP || '0.0.0.0',
  "PORT":process.env.PORT || '3000',
     // "IP": process.env.IP, 
  // "PORT":process.env.PORT,
    "color_theme": {
        "info":"rainbow",
        "data":"green",
        "error":"red",
        "warning":"yellow"
    },//estatico
    "STATIC_PATCH":"./static",
    "dbStringConnection":process.env.DB || "mongodb://calaca:1234@ds133261.mlab.com:33261/inventarios"
};