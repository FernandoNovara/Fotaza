'use strict'

const { dbConfig } = require("../database/db_con"),
                fs = require("fs"),
            { Op } = require("sequelize"),
     { Sequelize } = require("sequelize"),
     { minetypes } = require("../helppers/multerConfig"),
         watermark = require("jimp-watermark")

module.exports = {

    async show(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findAll(
                {
                    include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                    where: {
                        usuario_id: req.Usuario.id
                    }
                }
            )
            
            if( publicacion )
                res.render("Usuario/Usuario",{Publicacion: publicacion ,Usuario: req.Usuario})
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
                // res.json(comentarios)
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    

    async showAll(req,res){
        try {
                //Publicaciones Home

                const fecha = new Date();
                fecha.setMonth(fecha.getMonth() - 12)

                const publicacion = await dbConfig.Publicacion.findAll(
                    {
                        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('usuario_id')), 'usuario_id']],
                        limit: 35,
                        order: Sequelize.literal('rand()'),
                        where: {
                            Fecha_Creacion: {
                                [Op.gt]: fecha
                            }
                        }
                    }
                ),

                lista = []

                for (let i = 0; i < publicacion.length; i++)
                {
                    const post = await dbConfig.Publicacion.findOne({
                        include: ['Imagenes'],
                        where: {
                            usuario_id: publicacion[i].usuario_id
                        }
                    })
                    lista.push(post) 
                }

                //Destacados

                const fechaDestacados = new Date()
                fechaDestacados.setMonth(fechaDestacados.getDay() - 7)

                const listaDestacados = await dbConfig.Publicacion.findAll(
                    {
                        attributes: ["id"],
                        limit: 5,
                        where: {
                            Fecha_Creacion: {
                                [Op.gt]: fechaDestacados
                            }
                        }
                    }
                ),

                filtro1 = [],
                filtro2 = [],
                destacados = []

                for (let a = 0; a < listaDestacados.length; a++)
                {
                    const post = await dbConfig.Publicacion.findOne({
                        include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                        where: {
                            id: listaDestacados[a].id
                        }
                    })
                    filtro1.push(post) 
                }

                

                for(let b = 0; b < filtro1.length; b++)
                {
                    const count = await dbConfig.Valoracion.findAndCountAll({
                        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('publicacion_id')), 'publicacion_id']]
                        ,where: {publicacion_id: filtro1[b].id}
                        
                    })
                    if(count.count >= 1) //Regular la cantidad de valoraciones
                    {
                        filtro2.push(count.rows[0].publicacion_id)
                    }
                    
                }

                for (let c = 0; c < filtro2.length; c++)
                {
                    const sum = await dbConfig.Valoracion.sum("Estrellas",{
                        where: {
                            publicacion_id: filtro2[c]
                        }
                    })

                    const count = await dbConfig.Valoracion.count({
                        where: {
                            publicacion_id: filtro2[c]
                        }
                    })

                    if((sum/count) >= 4)// regular promedio
                    {
                        const post = await dbConfig.Publicacion.findOne({
                            include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                            where: {
                                id: filtro2[c]
                            }
                        })
                        destacados.push(post) 
                    }


                }
                
                if( publicacion )
                    if(destacados)
                        res.render("Home/Index",{Publicacion: lista ,Usuario: req.Usuario ,Destacados: destacados})
                    else
                        res.render("Home/Index",{Publicacion: lista ,Usuario: req.Usuario})
                else
                    res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    async showAllPublic(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findAll(
                {
                    include: [{
                        association: "Imagenes",
                        where: {
                            Estado: "Publico"
                        }
                    }]
                }
            )
            
            if( publicacion )
                res.render("Public/Public",{Publicacion: publicacion})
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    async Publicar(req,res){
        try {
            if(req.body.Estado == "Publico"){
                const options = {
                    'ratio': 0.6,
                    'opacity': 0.6,
                    'dstPath': `./storage/public_watermark/${req.file.filename}`
                }
    
                watermark.addWatermark(path.join(__dirname, `../storage/public/${req.file.filename}`), 
                                        path.join(__dirname, `../publics/img/Watermark.png`), 
                                        options)
            }

            if(req.body.Estado == "Protegido" && req.Usuario.watermark){
                if(req.Usuario.watermark.Tipo == "Imagen"){
                    const options = {
                        'ratio': 0.6,
                        'opacity': 0.6,
                        'dstPath': `./storage/private/${req.file.filename}`
                    }
        
                    watermark.addWatermark(path.join(__dirname, `../storage/private/${req.file.filename}`), 
                                            path.join(__dirname, `../storage/watermark/${req.Usuario.watermark.Marca}`), 
                                            options)
                }

                if(req.Usuario.watermark.Tipo == "Texto"){
                    const options = {
                        'text': req.Usuario.watermark.Marca,
                        'textSize': 8,
                        'dstPath': `./storage/private/${req.file.filename}`
                    }
        
                    watermark.addTextWatermark(path.join(__dirname, `../storage/private/${req.file.filename}`), 
                                            options)

                }
            }

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
            )

            deleteImg = await dbConfig.Imagen.destroy( { where: { id: Publicacion.imagen_id } } )
            

            if(deleteImg)
                res.json("Se elimino la publicacion")
            else {
                res.json("No sea podido eliminar la publicacion")
            }


        } catch (error) {
            res.json(error)
        }
    },

    async search(req,res){
        try {
            const buscar = await dbConfig.Etiqueta.findAll(
                {
                    include: ["Publicaciones"],
                    where: {
                        Nombre: {
                            [Op.like]: "%"+req.body.search+"%"
                          }
                    }
                }
            )

            const publicaciones = []

            for(let a = 0; a < buscar.length; a++)
            {
                const post = await dbConfig.Publicacion.findOne(
                    {
                        include: [{
                            association: "Imagenes",
                            where: {
                                Estado: "Publico"
                            }
                        }],
                        where: {
                            id: buscar[a].Publicaciones.id
                        }
                    }
                )
                publicaciones.push(post)
            }

            if(publicaciones)
                res.render("Public/Public",{Publicacion: publicaciones})
                // res.json(publicaciones)
        } catch (error) {
            res.json(error)
        }
    },


}