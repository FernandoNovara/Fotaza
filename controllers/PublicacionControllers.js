'use strict'

const { response } = require("express")
const { dbConfig } = require("../database/db_con"),
                fs = require("fs"),
            { Op } = require("sequelize"),
     { Sequelize } = require("sequelize"),
     { minetypes } = require("../helppers/multerConfig"),
         watermark = require("jimp-watermark")

module.exports = {

    // ---------------------------------------------
    // Mostrar mis publicaciones
    // ---------------------------------------------

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
                res.render("Usuario/Usuario",{Publicacion: publicacion ,Usuario: req.Usuario,MyTitle: "Perfil"})
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Mostrar una publicacion
    // ---------------------------------------------

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
                res.render("Publicacion/View",{Publicacion: publicacion ,Usuario: req.Usuario, Sum: sum, Count: count, Valorado: valorado, Comentarios: comentarios,MyTitle: "Publicacion"})
                // res.json(comentarios)
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Mostrar todas las publicaciones en Home
    // ---------------------------------------------

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
                        res.render("Home/Index",{Publicacion: lista ,Usuario: req.Usuario ,Destacados: destacados,MyTitle: "Home"})
                    else
                        res.render("Home/Index",{Publicacion: lista ,Usuario: req.Usuario})
                else
                    res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Mostrar Todas las Publicaciones Publicas
    // ---------------------------------------------

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
                res.render("Public/Public",{Publicacion: publicacion,MyTitle: "Publicaciones Publicas"})
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Crear una Publicacion
    // ---------------------------------------------

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
                            Nombre: req.body.Etiquetas.toLowerCase()
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

    // ---------------------------------------------
    // Mostrar una publicacion para actualizar
    // ---------------------------------------------

    async updateShow(req,res){
        try {
                const publicacion = await dbConfig.Publicacion.findOne(
                {
                    include: ["Imagenes","Etiquetas"],
                    where: {
                        id: req.params.id
                    }
                }
            )

                if(publicacion)
                    res.render("Publicacion/Update",{Publicacion: publicacion,Usuario: req.Usuario,MyTitle: "Actualizar Publicacion"})
                    // res.json(publicacion)
                else
                    res.json("No se pudo actualizar")

        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Actulizar una publicacion
    // ---------------------------------------------

    async update(req,res){
        try {
                const updatePost = await dbConfig.Publicacion.update(
                    {
                        Titulo: req.body.Titulo,
                        Categoria: req.body.Categoria,
                    },
                    {
                        where: {
                            id: req.body.publicacion_id
                        }
                    }
                ) 

                const updateTag = await dbConfig.Etiqueta.update(
                    {
                        Nombre: req.body.Etiquetas.toLowerCase()
                    },
                    {
                        where: {
                            id: req.body.etiqueta_id
                        }
                    }
                )

                if(updatePost)
                    res.redirect("/Home")
                else
                    res.json("No se pudo actualizar")

        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Eliminar Una publicacion
    // ---------------------------------------------

    async delete(req,res){
        try {
            const publicacion = await dbConfig.Publicacion.findOne(
                {
                    include: ["Imagenes"],
                    where: {
                        id: req.params.id
                    }
                }
            )
            
            if(publicacion.Imagenes.Estado == "Protegido"){
                fs.unlinkSync(path.join(__dirname, `../storage/private/${publicacion.Imagenes.Nombre}`))
            }
                
            if(publicacion.Imagenes.Estado == "Publico")
            {
                fs.unlinkSync(path.join(__dirname, `../storage/public/${publicacion.Imagenes.Nombre}`))
                fs.unlinkSync(path.join(__dirname, `../storage/public_watermark/${publicacion.Imagenes.Nombre}`))
            }
                
            

            const deleteImg = await dbConfig.Imagen.destroy( { where: { id: publicacion.Imagenes.id } } )
            
            if(deleteImg)
            {
                res.redirect("/Home")
            }
            else
            {
                res.json("No sea podido eliminar")
            }
        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Buscar Una publicacion publica
    // ---------------------------------------------

    async search(req,res){
        try {
            const buscar = await dbConfig.Etiqueta.findAll(
                {
                    include: ["Publicaciones"],
                    where: {
                        Nombre: {
                            [Op.like]: "%"+req.body.search.toLowerCase()+"%"
                          }
                    }
                }
            )

            const publicaciones = []
 

            for(let a = 0; a < buscar.length; a++)
            {
                const post = await dbConfig.Publicacion.findOne(
                    {
                        include: {
                            association: "Imagenes",
                            where: {
                                Estado: "Publico"
                            }
                        },
                        where: {
                            id: buscar[a].Publicaciones.id
                        }
                    }
                )
                if(post != null)
                {
                    publicaciones.push(post)
                }
                
            }


            if(publicaciones)
                res.render("Public/Public",{Publicacion: publicaciones,MyTitle: "Buscar Publicaciones"})
        } catch (error) {
            res.json(error)
        }
    },

    // ---------------------------------------------
    // Buscar una publicacion de home
    // ---------------------------------------------

    async searchHome(req,res){
        try {
                const buscar = await dbConfig.Etiqueta.findAll(
                    {
                        include: ["Publicaciones"],
                        where: {
                            Nombre: {
                                [Op.like]: "%"+req.body.search.toLowerCase()+"%"
                            }
                        }
                    }
                )

                const publicaciones = []
    

                for(let a = 0; a < buscar.length; a++)
                {
                    const post = await dbConfig.Publicacion.findOne(
                        {
                            include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                            where: {
                                id: buscar[a].Publicaciones.id
                            }
                        }
                    )
                    if(post != null)
                    {
                        publicaciones.push(post)
                    }
                    
                }     
                     

            if(buscar)
            {
                res.render("Publicacion/Buscar",{Publicacion: publicaciones, Usuario: req.Usuario,MyTitle: "Buscar Publicacion"})

                // res.json(buscar)
            }

        } catch (error) {
            res.json(error)
        }
    }

}