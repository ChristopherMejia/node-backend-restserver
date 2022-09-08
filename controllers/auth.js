
const { response, request, json } = require("express");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


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
        return res.status(500).json({
            msg: " Algo salio mal en el login"
        })
    }
   
}



const googleSignIn = async ( req = request, res = response ) => {
    const { id_token } = req.body;

    try{

        const { nombre, img, correo } = await googleVerify( id_token );
        // verificar si el correo existe en la bdd
        let usuario = await Usuario.findOne({correo});
        if( !usuario ){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                role: 'USER_ROLE'
            }

            usuario = new Usuario ( data );
            await usuario.save();
        }

        // si el usuaio esta en DB
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el adminstrador, usuario bloqueado'
            });
        }

        const token = await generarJWT( usuario.id );

        res.json({
           usuario,
           token
        })

    }catch ( error ) {
        console.log( {error} );

        return res.status( 400 ).json({
            msg: " El token no se pudo verificar"
        })
    }

}


module.exports = {
    login,
    googleSignIn
}