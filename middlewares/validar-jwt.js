const jwt = require('jsonwebtoken');
const { response, request } = require('express');


const Usuario = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next) => {

    const token = req.header('x-token');
    if ( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try{

        const { uid } = jwt.verify( token, process.env.SECRETOPRIVATEKEY)
        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);
        if (!usuario ){
            return res.status(401).json({
                msg: ' Usuario eliminado - usuario no existe en la DB'
            })
        }

        // verificar si el uid no esta eliminado
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado en false'
            })
        }

        req.usuario = usuario
        next();

    }catch( err ){
        console.log( err );
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}