'use strict'

const express = require('express'),
        router = express.Router(),
        UsuarioControllers = require('../controllers/UsuarioControllers'),
        PublicacionControllers = require('../controllers/PublicacionControllers'),
        ComentarioControllers = require('../controllers/ComentarioControllers'),
        ValoracionControllers = require('../controllers/ValoracionControllers'),
        AuthControllers = require('../controllers/AuthControllers'),
        router_protect = require('../middleware/router_protect'),
        { error404 } = require('../helppers/errores')

        router.get('/', (req,res)=>{ res.render("Login/Login") })
                .get("/Salir" , (req,res) => {
                        res.clearCookie("x-access-token")
                        res.redirect("/Login")
                })
        
        // Home
        
        .get('/Home',router_protect, (req,res)=>{ res.render("Home/Index",{Usuario: req.Usuario}) })

        // Usuario

        .get('/Usuario',router_protect, (req,res)=>{ res.render("Usuario/Usuario",{Usuario: req.Usuario}) })

        .post("/Registrarse",router_protect,UsuarioControllers.create)

        .get("/Usuario/show/:id",router_protect,UsuarioControllers.show)

        .post("/Usuario/Update",router_protect,UsuarioControllers.update)

        //Publicacion

        .get("/Public", (req,res)=> {res.render("Public/Public",{Usuario: req.Usuario})})

        .post("/Publicar",router_protect,PublicacionControllers.Publicar)

        .get("/Publicacion",router_protect,PublicacionControllers.show)

        .get("/Publicacion/showOne",router_protect,PublicacionControllers.showOne)

        .get("/Publicacion/show",router_protect,PublicacionControllers.showAll)

        .get("/Publicacion/Delete/:id",router_protect,PublicacionControllers.delete)

        .post("/Publicacion/Update",router_protect,PublicacionControllers.update)

        //Comentarios

        .post("/Comentario/Create",router_protect,ComentarioControllers.create)

        .get("/Comentario/Delete/:id",router_protect,ComentarioControllers.delete)

        .post("/Comentario/Update",router_protect,ComentarioControllers.update)

        //Valoracion

        .post("/Valoracion/Create",router_protect,ValoracionControllers.create)

        .get("/Valoracion/Delete/:id",router_protect,ValoracionControllers.delete)

        //Login

        .get('/Login', (req,res)=>{ res.render("Login/Login") })

        .get('/Login/Registrarse', (req,res)=>{ res.render("Login/Registrarse") })

        .post("/Login",AuthControllers.login)

        .post("/Login/Registrarse",AuthControllers.signup)

        .use( error404 )




module.exports = router