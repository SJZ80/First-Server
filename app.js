//Token en cabecera
//https://medium.com/@asfo/autenticando-un-api-rest-con-nodejs-y-jwt-json-web-tokens-5f3674aba50e
//https://www.oscarblancarteblog.com/2017/06/08/autenticacion-con-json-web-tokens/

const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const jwt = require('jsonwebtoken');
const app = express();
const key = require('./config');
// const mongoClient = require('mongodb').MongoClient;
// const assert = require('assert');


// Configuration
app.set('port',3000);
app.set('view engine', 'ejs');


var validaToken = (req,res,next)=>{

    const {username, password,token} = req.body
    
    if (!username && !password){    

        if (token) {

            jwt.verify(token,key.secretkey,(failed,successfull)=>{

                 if (failed) {

                     return res.json({ mensaje: 'Token inválida' }); 
                    
                 }else{

                        //res.json(successfull);    
                        next();

                }
                

            })
           
                
        }else{

            res.json({advertencia:'Tiene que proveer un token'})
        }
    }else{

        next()
    }
    
};

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(validaToken);

//Routes
app.use('/v1',routes)

// Serivicio

app.listen(app.get('port'),()=>console.log(`Server listening on port: ${app.get('port')}`));
