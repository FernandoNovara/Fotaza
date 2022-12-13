'use strict'

const { dbConfig } = require("../database/db_con"),
                fs = require("fs"),
    {  minetypes } = require("../helppers/multerConfig")

module.exports = {

    async update(req,res){
        const Usuario = await dbConfig.Usuario.update(
            {
                Nombre : req.body.Nombre,
                Apellido : req.body.Apellido,
                Email : req.body.Email,
                Clave : req.body.Clave,
                Interes : req.body.Interes,
                Ciudad : req.body.Ciudad,
                Telefono : req.body.Telefono,
                Fecha_Nac : req.body.Fecha_Nac,
                Avatar : req.file.filename
            },
            {
                where: {
                    id: req.Usuario.id
                }
            })

            if(Usuario)
            res.redirect("/Usuario")
        else
            res.json({error: "No se encontro ningun dato"})
    }
}