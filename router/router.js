'use strict'

const express = require('express'),
        router = express.Router(),
        UsuarioControllers = require('../controllers/UsuarioControllers'),
        PublicacionControllers = require('../controllers/PublicacionControllers'),
        ComentarioControllers = require('../controllers/ComentarioControllers'),
        ValoracionControllers = require('../controllers/ValoracionControllers')

        router.get('/', (req,res)=>{ res.render("Home/index") })

        // Usuario

        .get('/Usuario', (req,res)=>{ res.render("Usuario/Usuario") })

        .post("/Registrarse",UsuarioControllers.create)

        .get("/Usuario/show/:id",UsuarioControllers.show)

        .post("/Usuario/Update",UsuarioControllers.update)

        //Publicacion

        .post("/Publicar",PublicacionControllers.Publicar)

        .get("/Publicacion",PublicacionControllers.show)

        .get("/Publicacion/showOne",PublicacionControllers.showOne)

        .get("/Publicacion/show",PublicacionControllers.showAll)

        .get("/Publicacion/Delete/:id",PublicacionControllers.delete)

        .post("/Publicacion/Update",PublicacionControllers.update)

        //Comentarios

        .post("/Comentario/Create",ComentarioControllers.create)

        .get("/Comentario/Delete/:id",ComentarioControllers.delete)

        .post("/Comentario/Update",ComentarioControllers.update)

        //Valoracion

        .post("/Valoracion/Create",ValoracionControllers.create)

        .get("/Valoracion/Delete/:id",ValoracionControllers.delete)


module.exports = router