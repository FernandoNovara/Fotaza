'use strict'

const express = require('express'),
        router = express.Router()

        router.get('/', (req,res)=>{ res.render("Home/index") })

        // Usuario

        .get('/Usuario', (req,res)=>{ res.render("Usuario/Usuario") })



module.exports = router