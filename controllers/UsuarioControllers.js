'use strict'

const { dbConfig } = require("../database/db_con")

module.exports = {
    async show(req,res){
        try {
            const Usuario = await dbConfig.Usuario.findOne(
                {
                    where: {
                        id: req.params.id
                    }
                }
            )

            if(Usuario)
                res.json(Usuario)
            else
                res.json({error: "No se encontro ningun dato"})
        } catch (error) {
            res.json(error)
        }
    },

    async create(req,res){
        const Usuario = await dbConfig.Usuario.create(
            {
                Nombre : req.body.Nombre,
                Apellido : req.body.Apellido,
                Email : req.body.Email,
                Clave : req.body.Clave,
                Interes : req.body.Interes,
                Ciudad : req.body.Ciudad,
                Telefono : req.body.Telefono,
                Fecha_Nac : req.body.Fecha_Nac,
                Avatar : " "
            }
        )

        if(Usuario)
            res.json(Usuario)
        else{
            res.json({error: "No se cargo el Usuario"})
        }
    },

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
                Avatar : " "
            },
            {
                where: {
                    id: req.body.id
                }
            })

            if(Usuario)
            res.json(Usuario)
        else
            res.json({error: "No se encontro ningun dato"})
    }
}