
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, 
        validarJWT, 
        esAdminRole, 
        tipoDeRol } = require('../middlewares');

const { esRoleValido, 
        emailExiste, 
        existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get( '/', usuariosGet );

router.put( '/:id', [
        check('id', ' No es un ID válido').isMongoId(),
        check('id').custom( (id) => existeUsuarioPorId( id )),
        check('role').custom( (role) => esRoleValido(role) ),

        validarCampos
],usuariosPut)

router.post( '/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser más de 6 letras').isLength({min: 6}),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( (correo) => emailExiste(correo) ),
        // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        //Validamos que el rol exista en la base de datos
        check('role').custom( (role) => esRoleValido(role) ),
        validarCampos //middleware creado, para mostar los errores
], usuariosPost)

router.patch( '/', usuariosPatch)

router.delete( '/:id',[
        validarJWT,
        // esAdminRole,  /fuerza a que el usuario tenga rol de administrador
        tipoDeRol('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', ' No es un ID válido').isMongoId(),
        check('id').custom( (id) => existeUsuarioPorId( id )),
        validarCampos //middleware creado, para mostar los errores
], usuariosDelete)

module.exports = router;