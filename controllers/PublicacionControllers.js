'use strict'
const { dbConfig } = require("../database/db_con"),
                fs = require("fs"),
     { minetypes } = require("../helppers/multerConfig")

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
                        id: req.params.id
                    }
                }
            )

            const valorado = await dbConfig.Valoracion.findOne(
                {
                    where: {
                        usuario_id: req.Usuario.id,
                        publicacion_id: publicacion.id
                    }
                }
            )
            
            const sum = await dbConfig.Valoracion.sum("Estrellas",{
                where: {
                    publicacion_id: publicacion.id
                }
            })
            const count = await dbConfig.Valoracion.count({
                where: {
                    publicacion_id: publicacion.id
                }
            })

            const comentarios = await dbConfig.Comentario.findAll({
                include: ["Usuario"],
                where: {
                    publicacion_id: publicacion.id
                }
            })


            if( publicacion )
                res.render("Publicacion/View",{Publicacion: publicacion ,Usuario: req.Usuario, Sum: sum, Count: count, Valorado: valorado, Comentarios: comentarios})
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
                res.render("Home/Index",{Publicacion: publicacion ,Usuario: req.Usuario})
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
                    Nombre: req.file.filename,
                    Estado: req.body.Estado,
                    Formato: req.file.mimetype,
                    Tamaño: req.file.size,
                    Resolucion: req.body.resolucion,
                    Derecho_Uso: req.body.Derecho_Uso,
                    usuario_id: req.body.usuario_id
                }
            ),

                Publicacion = await dbConfig.Publicacion.create(
                {
                    Titulo: req.body.Titulo,
                    Categoria: req.body.Categoria,
                    Fecha_Creacion: Date.now(),
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
                res.redirect("/Home")
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