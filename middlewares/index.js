
/**
 * Importamos todos los middlwares necesario para tener cada una de
 * de las importaciones en el archivo.
 * 
 * Con el operador spret (...) así exportamos todos los archivos de la constante declarada
 */

const validaJWT  = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validaCampos = require('../middlewares/validar-campos');


module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
}