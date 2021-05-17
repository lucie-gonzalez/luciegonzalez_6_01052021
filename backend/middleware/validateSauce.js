/////Import de Mongoose Validator : pour une sauvegarde de données propres et correctement formatées = application plus sécurisée contre les injections de code.
var validate = require('mongoose-validator')
 
exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50], 
    message: 'Le nom de votre Sauce doit contenir entre {ARGS[3]} and {ARGS[50]} caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, 
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer votre sauce",
  }),
]

exports.manufacturerValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 40], 
    message: 'Le nom du fabricant doit contenir entre {ARGS[3]} et {ARGS[40]} caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, 
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer le fabricant",
  }),
]

exports.descriptionValidator = [
  validate({
    validator: 'isLength',
    arguments: [10, 150],
    message: 'La description de la sauce doit contenir entre {ARGS[10]} et {ARGS[150]} caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, 
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour la description de la sauce",
  }),
]

exports.mainPepperValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 25], 
    message: 'L ingrédient principal doit contenir entre {ARGS[3]} et {ARGS[25]} caractères',
  }),
  validate({
    validator: 'matches', 
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour la description de l ingrédient principal",
  }),
]; 