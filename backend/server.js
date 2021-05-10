//Import de Node.js
const http = require("http");
//Import de l'application Express dans le serveur
const app = require("./app");

//Fonction permettant de récupérer un port valide
//sous la forme d'un numéro ou d'une chaîne de caractères
const normalizePort = function(val){
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }
    return false;
};

//Récupération d'un port valide selon la plateforme de déploiement
// ou le port 3000
const port = normalizePort(process.env.PORT || 3000);

//Attribution du port à l'application
app.set("port", port);

//Traitement des erreurs serveur
const errorHandler = function(error){
    if(error.syscall !== "listen"){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code){
        case "EACCES" :
            console.error(bind + " requires elevated privileges.");
            process.exit(1);
            break;
        case "EADDRINUSE" :
            console.error(bind + " is already in use.");
            process.exit(1);
            break;
        default :
            throw error;
    }
};

//Création du server Node
const server = http.createServer(app);

//Gestion des erreurs serveur
server.on("error", errorHandler);

//Lancement du serveur
server.on("listening", function(){
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port ;
    console.log("Listening on " + bind);
});

//Le serveur écoute le port sélectionné préalablement
server.listen(port);