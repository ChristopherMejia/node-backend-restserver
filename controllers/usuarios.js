const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    // const {q, nombre, apikey, limit, page = 1} = req.query;
    const { limite, desde } = req.query;
    const usuarios = await Usuario.find()
        .skip( Number(desde) )
        .limit( Number(limite) );

    res.json({ usuarios });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, role, } = req.body;
    const usuario = new Usuario( {nombre, correo, password, role } );

    /// Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    /// Guerdar en DB
    await usuario.save();

    res.json({ usuario });
}

const usuariosPut = async (req, res = response) => {

    const {id} = req.params;
    const { _id, password, google, correo, ...requestBody } = req.body;

    //TODO validar contra base de datos
    if( password ) {
        /// Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        requestBody.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, requestBody, { new: true});

    res.json({ usuario });
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    //fisicamente se borra de la bdd
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false}, { new: true} );
    const usuarioAuthenticado = req.usuario
    res.json({       
        usuario,
        usuarioAuthenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}