const { response, request } = require("express")


const esAdminRole = ( req = request, res = response, next) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el JWT'
        });
    }

    const { role, nombre } = req.usuario

    if ( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next();
}


const tipoDeRol = ( ...roles ) => {
    // regresa una función que se ejecuta en el routes.usuarios
    // es un caso especial para recibir parametros en algun middleware
    return ( req, res = response, next) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se require verificar el role sin validar el JWT'
            });
        }

        if( !roles.includes( req.usuario.role) ){
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}`
            });
        }


        next();
    }
}


module.exports = {
    esAdminRole,
    tipoDeRol
}