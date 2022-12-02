'use strict'

const { json } = require("sequelize")
const { dbConfig } = require("../database/db_con")

module.exports = {

    async create(req,res){
        try {
            const comentario = await dbConfig.Comentario.create(
                {
                    Fecha: req.body.Fecha,
                    Descripcion: req.body.Descripcion,  
                    publicacion_id: req.body.publicacion_id,
                    usuario_id: req.body.usuario_id
                }
            )

            if(comentario)
                res.json(comentario)
            else
                res.json("No se pudo crear el comentario")
        } catch (error) {
            res.json(error)
        }
    },

    async update(req,res){
        try {
            const comentario = await dbConfig.Comentario.update(
                {
                    Descripcion: req.body.Descripcion
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )

            if(comentario)
                res.json("El comentario fue editado correctamente")
            else
                res.json("No se pudo crear el comentario")
        } catch (error) {
            res.json(error)
        }
    },

    async delete(req,res){
        try {

            const comentario = await dbConfig.Comentario.destroy(
                {
                    where: {
                        id: req.params.id
                    }
                }
            )

            if( comentario )
                res.json("Se ha eliminado el comentario")
            else
                res.json("No sea podido eliminar")
            
        }
        catch (error) {
            res.json(error)
        }
    }

}