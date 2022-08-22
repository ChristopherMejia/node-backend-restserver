const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = (req = request, res = response) => {

    const {q, nombre, apikey, limit, page = 1} = req.query;
    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        limit,
        page
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, role, } = req.body;
    const usuario = new Usuario( {nombre, correo, password, role } );

    /// Verificar si el correo existe

    /// Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    /// Guerdar en DB
    await usuario.save();

    res.json({ usuario });
}

const usuariosPut = (req, res = response) => {

    const {id} = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res = response) => {

    res.json({
        msg: 'delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}