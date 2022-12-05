const { dbConfig } = require( '../database/db_con' ),
        bcrypt = require( 'bcrypt' ),
        jwt = require( 'jsonwebtoken' ),
        authConf = require( '../config/authConfig' )

module.exports = {

    async login( req,res ){
        try {
            const {Email, Clave} = req.body
            const Usuario = await dbConfig.Usuario.findOne( 
                {
                    where: {
                        Email: Email
                    }
                }
            )

            
            if( !Usuario ){
                res.render( 'Login/Login', {error: 'Login'} )
            }else{
                if( bcrypt.compareSync( Clave, Usuario.Clave ) ){

                    // devolver token
                    const token = await jwt.sign( {Usuario: Usuario}, authConf.secret, {
                        expiresIn: authConf.expire
                    } )

                    let options = {
                        path:"/",
                        sameSite:true,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true, // The cookie only accessible by the web server
                    }
                    
                    res.cookie( 'x-access-token', token, options )
                                       
                    res.redirect( '/Home' ) 

                }else{
                    res.render( 'Login/Login',{ error: 'Clave' } )
                }
            }

        } catch ( error ) {
            res.json( error )
        }
    },

    async signup( req,res ){
        const existUsuario = await dbConfig.Usuario.findOne( 
            {
                where: {
                    Email: req.body.Email
                }
            }
        )
        
        if( existUsuario ){
            res.render( 'Login/Registrarse', { existUsuario: true } )
        }else{
            const hash = bcrypt.hashSync( req.body.Clave, parseInt( authConf.round ) )
        
            const usuario = await dbConfig.Usuario.create( 
                    {
                        Nombre: req.body.Nombre,
                        Apellido: req.body.Apellido,
                        Email: req.body.Email,
                        Clave: hash,
                        Telefono: req.body.Telefono,
                        Fecha_Nac: req.body.Fecha_Nac,
                        Interes: req.body.Interes,
                        Ciudad: req.body.Ciudad,
                        Avatar: "adawdasdawds" //req.file.filename,
                    }
            )

            if( usuario ){
                return res.render( 'Login/Login', {registro: true} )
            }
        }
        
    }
}