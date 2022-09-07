
const { response } = require("express");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


const Usuario = require('../models/usuario');


const login = async ( req, res = response ) => {

    const { correo, password } = req.body
    try{
        // verififcar si el email existe
        const usuario = await Usuario.findOne({correo});
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son corrrectos - correo'
            })
        }

        // verificar si el usuario esta activo
        if ( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son corrrectos - estado: false'
            })
        }

        // verificcar la contraseña

        const validPassword = bcryptjs.compareSync( password, usuario.password);
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son corrrectos - password'
            })
        }

        // generar el json web token
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    }catch(error){
        console.log( {error} );
        return res.status(500).json({
            msg: " Algo salio mal en el login"
        })
    }
   
}


module.exports = {
    login
}