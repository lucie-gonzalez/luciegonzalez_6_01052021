// Permets de gérer les fichiers entrants dans les requêtes HTTP  
const multer = require('multer'); 

//Dictionnaire des différents types d'images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Constante permettant l'enregistrement des fichiers images
//dans le dossier image
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Export de la configuration du multer
module.exports = multer({storage: storage}).single('image');

