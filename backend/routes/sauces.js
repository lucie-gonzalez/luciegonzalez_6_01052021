  
//Import du framework Express
const express = require('express');
const router = express.Router();

//Import du middleware d'authentification
const auth = require('../middleware/auth');

//Import du middleware pour la gestion des images
const multer = require('../middleware/multer-config');

//Import du middleware pour les sauces
const sauceCtrl = require('../controllers/sauce');

//Les différentes routes avec leur endpoints pour les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.definedStatusSauce);

//Export du router pour les sauces
module.exports = router;