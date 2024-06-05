const jwt = require('jwt-simple');
const moment = require('moment');
const libjwt = require('../service/jwt');
const secret = libjwt.secret;

exports.auth = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autorización"
        });
    }

    let token = req.headers.authorization.replace(/["']+/g, '');

    try {
        let payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Token expirado"
            });
        }

        req.user = payload;
        next(); // Agrega next() aquí para pasar al siguiente middleware
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token inválido",
            error
        });
    }
};
