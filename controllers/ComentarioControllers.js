'use strict'

const { json } = require("sequelize")
const { dbConfig } = require("../database/db_con")

module.exports = {

    async create(req,res){
        try {
            const comentario = await dbConfig.Comentario.create(
                {
                    Fecha: Date.now(),
                    Descripcion: req.body.Descripcion,  
                    publicacion_id: req.body.publicacion_id,
                    usuario_id: req.Usuario.id
                }
            )

            if(comentario)
            res.redirect(`/Publicacion/showOne/${req.body.publicacion_id}`)
            else
                res.json("No se pudo crear el comentario")
        } catch (error) {
            res.json(error)
        }
    }
}