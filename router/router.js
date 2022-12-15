'use strict'

const express = require('express'),
        router = express.Router(),
        { multerDefaultStorage } = require("../helppers/multerConfig"),
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
        
        .get('/Home',router_protect, PublicacionControllers.showAll)

        // Usuario

        .get('/Usuario',router_protect,router_protect,PublicacionControllers.show)

        .post("/Usuario/Update",router_protect,multerDefaultStorage("avatar").single("Avatar"),UsuarioControllers.update)

        .post("/Usuario/Watermark",router_protect,multerDefaultStorage("watermark").single("watermark"),UsuarioControllers.addWatermark)

        .post("/Usuario/Textomark",router_protect,UsuarioControllers.addWatermark)

        .post("/Usuario/Delete",router_protect,UsuarioControllers.deleteWatermark)

        //Publicacion

        .post("/Search",PublicacionControllers.search)

        .get("/Public", PublicacionControllers.showAllPublic)

        .get("/Publicacion/Create",router_protect, (req,res)=> {res.render("Publicacion/Create",{Usuario: req.Usuario})})

        .get("/Publicacion/Update/:id",router_protect,PublicacionControllers.updateShow)

        .post("/Publicacion/Update",router_protect,PublicacionControllers.update)

        .post("/Publicar/Private",router_protect,multerDefaultStorage("private").single("image"),PublicacionControllers.Publicar)

        .post("/Publicar/Publico",router_protect,multerDefaultStorage("public").single("image"),PublicacionControllers.Publicar)

        .post("/BuscarHome",router_protect,PublicacionControllers.searchHome)

        .get("/Buscar",router_protect,(req,res)=> {res.render("Publicacion/Buscar",{Usuario: req.Usuario})})

        .get("/Publicacion/showOne/:id",router_protect,PublicacionControllers.showOne)

        .get("/Publicacion/show",router_protect,PublicacionControllers.showAll)

        .get("/Publicacion/Delete/:id",router_protect,PublicacionControllers.delete)

        //Comentarios

        .post("/Comentario/Create",router_protect,ComentarioControllers.create)

        //Valoracion

        .post("/Valoracion/Create",router_protect,ValoracionControllers.create)

        //Login

        .get('/Login', (req,res)=>{ res.render("Login/Login") })

        .get('/Login/Registrarse', (req,res)=>{ res.render("Login/Registrarse") })

        .post("/Login",AuthControllers.login)

        .post("/Login/Registrarse",AuthControllers.signup)

        .use( error404 )




module.exports = router