//Token en cabecera
//https://medium.com/@asfo/autenticando-un-api-rest-con-nodejs-y-jwt-json-web-tokens-5f3674aba50e
//https://www.oscarblancarteblog.com/2017/06/08/autenticacion-con-json-web-tokens/
//https://trevorsullivan.net/2017/03/11/change-vscode-integrated-terminal-powershell/
//http://mongodb.github.io/node-mongodb-native/3.2/tutorials/crud/
//https://www.openmymind.net/2012/2/3/Node-Require-and-Exports/
//https://webkul.com/blog/types-of-authentication-wiz-oauth-digest-basic-token-based/
//https://jwt.io/

//215927426

//import * as express from 'express';
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const jwt = require('jsonwebtoken');
const app = express();
const key = require('./config');
const cors = require('cors');
const path = require('path');
// const mongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// Configuration

app.set('port',3000);
app.set('view engine', 'ejs');
//app.set("views", path.join(__dirname, "views"));
  

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
app.use(express.static( path.join(__dirname, "public") ));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(validaToken);

//Routes

app.use('/v1',routes)

app.listen(app.get('port'),'delnb0003tqjbh2.agdcorp.com.ar',()=>console.log(`Server listening on port: ${app.get('port')}`));

