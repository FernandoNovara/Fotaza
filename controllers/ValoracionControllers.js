'use strict'

const { dbConfig } = require("../database/db_con")

module.exports = {

    async create(req,res){
        try {
            const valoracion = await dbConfig.Valoracion.create(
                {
                    Estrellas: req.body.Estrellas,  
                    publicacion_id: req.body.publicacion_id,
                    usuario_id: req.body.usuario_id
                }
            )

            if(valoracion)
                res.json(valoracion)
            else
                res.json("No se pudo crear el comentario")
        } catch (error) {
            res.json(error)
        }
    },

    async delete(req,res){
        try {

            const valoracion = await dbConfig.Valoracion.destroy(
                {
                    where: {
                        id: req.params.id
                    }
                }
            )

            if( valoracion )
                res.json("Se ha eliminado el comentario")
            else
                res.json("No sea podido eliminar")
            
        }
        catch (error) {
            res.json(error)
        }
    }

}