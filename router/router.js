'use strict'

const express = require('express'),
        router = express.Router()

        router.get('/', (req,res)=>{
            res.render("Home/index")
        })


module.exports = router