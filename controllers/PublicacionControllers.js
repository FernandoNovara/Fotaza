'use strict'

const { json } = require("sequelize")
const { dbConfig } = require("../database/db_con")

module.exports = {

    async show(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findAll(
                {
                    include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                    where: {
                        usuario_id: req.body.usuario_id
                    }
                }
            )
            
            if( publicacion )
                res.json(publicacion)
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    async showOne(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findOne(
                {
                    include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                    where: {
                        id: req.body.id
                    }
                }
            )
            
            if( publicacion )
                res.json(publicacion)
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    async showAll(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findAll(
                {
                    include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"] 
                }
            )
            
            if( publicacion )
                res.json(publicacion)
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    async Publicar(req,res){
        try {
            const Imagen = await dbConfig.Imagen.create(
                {
                    Nombre: req.body.Nombre,
                    Estado: req.body.Estado,
                    Formato: req.body.Formato,
                    Tamaño: req.body.Tamaño,
                    Resolucion: req.body.Resolucion,
                    Derecho_Uso: req.body.Derecho_Uso,
                    usuario_id: req.body.usuario_id
                }
            ),

                Publicacion = await dbConfig.Publicacion.create(
                {
                    Titulo: req.body.Titulo,
                    Categoria: req.body.Categoria,
                    Fecha_Creacion: req.body.Fecha_Creacion,
                    usuario_id: req.body.usuario_id,
                    imagen_id: Imagen.id,
                    Etiquetas: [
                        { 
                            Nombre: req.body.Etiquetas
                        }]
                },
                {
                    include: ["Etiquetas"]
                }
            
            )

            if(Publicacion)
                res.json(Publicacion)
            else
                res.json("No se pudo ingresar la publicacion")
        } catch (error) {
            res.json(error)
        }
    },

    async update(req,res){
        try {
                const publicacion = await dbConfig.Publicacion.findOne(
                    {
                        where: {
                            id: req.body.id
                        }
                    }  
                )
                const updatePost = await dbConfig.Publicacion.update(
                    {
                        Titulo: req.body.Titulo,
                        Categoria: req.body.Categoria
                    },
                    {
                        where: {
                            id: req.body.id
                        }
                    }    
                )
                const updateImg = await dbConfig.Imagen.update(
                    {
                        Estado: req.body.Estado,
                        Derecho_Uso: req.body.Derecho_Uso
                    },
                    {
                        where: {
                            id: publicacion.imagen_id
                        }
                    }    
                )

                if(updatePost && updateImg)
                    res.json("Se ha actualizado Correctamente")
                else
                    res.json("No se pudo actualizar")

        } catch (error) {
            res.json(error)
        }
    },

    async delete(req,res){
        try {
            const Publicacion = await dbConfig.Publicacion.findOne(
                {
                    attributes: ["imagen_id"],
                    where: {
                        id: req.params.id
                    }
                }
            ),

            deleteImg = await dbConfig.Imagen.destroy( { where: { id: Publicacion.imagen_id } } )
            

            if(deleteImg)
                res.json("Se elimino la publicacion")
            else {
                res.json("No sea podido eliminar la publicacion")
            }


        } catch (error) {
            res.json(error)
        }
    }

}