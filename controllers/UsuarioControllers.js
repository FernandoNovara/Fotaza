'use strict'

const { addWatermark } = require("jimp-watermark")
const { dbConfig } = require("../database/db_con"),
                fs = require("fs"),
    {  minetypes } = require("../helppers/multerConfig")

module.exports = {

    // ---------------------------------------------
    // Actualizar datos de perfil
    // ---------------------------------------------

    async update(req,res){

        const avatarUsuario = await dbConfig.Usuario.findOne({
            attibutes: ["Avatar"],
            where:
            {
                id: req.Usuario.id
            }
        })
   
        if(avatarUsuario.Avatar != "null")
        {
            fs.unlinkSync(path.join(__dirname, `../storage/avatar/${avatarUsuario.Avatar}`))
        }

        var Usuario = await dbConfig.Usuario.update(
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
    },

    // ---------------------------------------------
    // Crear una marca de agua Texto/Imagen
    // ---------------------------------------------

    async addWatermark(req,res){
        try {
            const watermark = await dbConfig.Watermark.create(
                {
                    Tipo: req.body.Tipo,
                    Marca: req.file ? req.file.filename : req.body.watermark,
                    usuario_id: req.Usuario.id
                }
            )
            if(watermark)
            {
                res.redirect("/Usuario")
            }
        } 
        catch (error) {
            res.json(error)
        }

    },

    // ---------------------------------------------
    // Eliminar Marca de agua
    // ---------------------------------------------

    async deleteWatermark(req,res){
        try {

            if(req.Usuario.watermark.Tipo == "Imagen")
            {
                fs.unlinkSync(path.join(__dirname,`../storage/watermark/${req.Usuario.watermark.Marca}`))
            }

            const deleteWatermark = await dbConfig.Watermark.destroy(
                {
                    where: {
                        usuario_id: req.Usuario.id
                    }
                }
            )
            if(deleteWatermark)
            {
                res.redirect("/Usuario")
            }
        } 
        catch (error) {
            res.json(error)
        }

    },
}