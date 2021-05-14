// import du package HTTP natif de Node et creation du serveur
const http = require('http');

//Import de l'application Express dans le serveur
const app = require('./app');

// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

  //Récupération d'un port valide selon la plateforme de déploiement
// ou le port 3000
  const port = normalizePort(process.env.PORT || '3000');

  //Attribution du port à l'application
  app.set('port', port);
  
  //Traitement des erreurs serveur
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

//Création du server Node  
const server = http.createServer(app);
  
//Gestion des erreurs serveur
  server.on('error', errorHandler);

//Lancement du serveur
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
  });
  
  // Un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
  server.listen(port);