const express = require('express'),
      rutas = express.Router(),
      path = require('path'),
      usuarios = [{"nombre":"Diego","apellido":"Rosellini","edad":41,"password":"pepe"},
                  {"nombre":"Nico","apellido":"Chialvo","edad":35,"password":"pepe1"},
                  {"nombre":"Andres","apellido":"Salinero","edad":58,"password":"pepe2"}],
      jwt =require('jsonwebtoken');
      key = require('../config');


//Generate Token
rutas.post('/token',(req,res,next)=>{

    const { username,password} = req.body;

    console.log(username,password);
    
    
    var usuario = usuarios.filter((usuario)=>{

        return usuario.nombre === username && usuario.password === password

    })[0];

    if (usuario) {
        
        //console.log(JSON.stringify({silvio:"123"}));
         
        const token = jwt.sign({usuario:username},key.secretkey,{expiresIn: 60 * 60 * 24});

        res.send({'token':token});

        // var decoded = jwt.decode(token, {complete: true});
        // console.log(decoded.header);
        // console.log(decoded.payload)
        // console.log(decoded.signature);
    }else{

        res.json({'error':3, 'descripcion':"Usuario o Contraseña incorrecta"});
    }
    
    next()
   
})

//List of Users
rutas.post('/user/listusers',(req,res,next)=>{

   
    const {usuario} = req.body;
    
    if (usuario === '*ALL') {
        console.log("Entro por igual");
        
        res.send(usuarios);

        }else{
            
            res.send({"error":1,"Descripcion":"Verifique el valor pasado"})
    }
    
    next() 
   
})

//Find Single User
rutas.get('/user/:username',(req,res,next)=>{
    
    var usuario = usuarios.filter((usuario)=>{

        return usuario.nombre === req.params.username;

    })[0];

    if (!usuario) {

        usuario = {'error':1,'descripcion':"Usuario No encontrado"};
        
    }

    res.send(usuario);
        
    
    next() ;
   
})