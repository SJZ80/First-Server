const express = require('express'),
      rutas = express.Router(),
      path = require('path'),
      usuarios = [{"nombre":"Diego","apellido":"Rosellini","edad":41,"password":"pepe"},
                  {"nombre":"Nico","apellido":"Chialvo","edad":35,"password":"pepe1"},
                  {"nombre":"Andres","apellido":"Salinero","edad":58,"password":"pepe2"}],
      jwt =require('jsonwebtoken');
      key = require('../config');
      mongoClient = require('mongodb').MongoClient;
      assert = require('assert');


// Connection Database

const URL = 'mongodb://localhost:27017';
const DATABASE = 'primer_db';
const client = new mongoClient(URL);
  
      

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

//Find
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

//add

rutas.post('/user/add',(req,res,next)=>{

    const {nombre,apellido,edad,password} = req.body;
    var usuario = {nombre:nombre,apellido:apellido,edad:edad,password:password};    
    var resultado = "bla";
    
      
    //Connection to server
    client.connect((error,result)=>{

        try {

            assert.equal(null,error);

            console.log("Connection established");
            
            //Connection to Databese
            const db = client.db(DATABASE);
            const keyFind = {
                nombre:nombre
            };

            console.log(keyFind);
            
            ()=>{}                  
            db.collection('user').find(keyFind).limit(2).toArray((err,doc)=>{
                
                console.log("en el find");
            
                try{
                    
                    assert.equal(null, err);
                    assert.equal(0, doc.length);    

                    db.collection('user').insertOne(usuario,(error,result)=>{

                        try {
                                                       
                            assert.equal(null,error);
                            assert.equal(1,result.insertedCount);
                            resultado = "Added User";
                            console.log("Registro Insertado");
                            client.close();
                            res.send({message:"User Inserted"})                    
                            
                
                        } catch (error) {
                            
                            console.log(error);
                            client.close();
                            
                        }
                
                    })

                }catch(error){
                    
                    console.log("Registro existente");
                    resultado = "Exist User";
                    client.close();
                    res.send({message:"User Exist"}) 
                                       
                }

            })
            
            console.log("Termino el find");

        } catch (error) {
            
            console.log("Connection refused!!");

        }                        
        
    })
    
    console.log("Termino el connect");
    //res.send(usuario);
   next() ;
   
})

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


rutas.get('/users',(req,res,next)=>{

    res.send(usuarios);

    next() 
   
})


module.exports = rutas;