const express = require('express'),
      rutas = express.Router(),
      path = require('path'),
      usuarios = [{"nombre":"Diego","apellido":"Rosellini","edad":41,"password":"pepe"},
                  {"nombre":"Nico","apellido":"Chialvo","edad":35,"password":"pepe1"},
                  {"nombre":"Andres","apellido":"Salinero","edad":58,"password":"pepe2"}],
      jwt =require('jsonwebtoken');
      key = require('../config');
      assert = require('assert');
      DATABASE = require('../database');       



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

rutas.post('/user/add',(req,res,next)=>{

    const {nombre,apellido,edad,password} = req.body;
    var usuario = {nombre:nombre,apellido:apellido,edad:edad,password:password};    
       
    // Use connect method to connect to the Server
    DATABASE.client.connect(function(err, client) {
        try{
        
            assert.equal(null, err);
            console.log("Connected correctly to server");
            
            const db = DATABASE.client.db(DATABASE.DATABASE)
               
            db.collection('user').find(usuario).limit(2).toArray(function(err, docs) {
            
                try{
            
                    assert.equal(null, err);
                    assert.equal(0, docs.length);

                        // Insert a single document
                        db.collection('user').insertOne(usuario, function(err, r) {
                            
                            try{
                            
                                console.log(err);
                                console.log(r.insertedCount);
                                assert.equal(null, err);
                                assert.equal(1, r.insertedCount);
                                DATABASE.client.close();
                                res.send({message:"User Inserted"});
                            
                            }catch (error){
                                
                                DATABASE.client.close();
                                res.send({message:"Not User Inserted"})

                            }    
                        });
                }catch (error) {
                    
                    console.log("Registro existente");
                    DATABASE.client.close();
                    res.send({message:"User Exist"});


                }
            });    
        }catch (error) {

            console.log("Connection refused!!!");
            res.send({message:"Verify the connection"})            

        }       

    },{ useUnifiedTopology: true,useNewUrlParser: true });


})


rutas.post('/user/listusersdb',(req,res,next)=>{

   
    const {usuario} = req.body;
    
    if (usuario === '*ALL') {
        
        DATABASE.client.connect(function(err, client) {
            
            try{
            
                assert.equal(null, err);
                console.log("Connected correctly to server");
                
                const db = DATABASE.client.db(DATABASE.DATABASE)
                   
                db.collection('user').find({}).limit(0).toArray(function(err, docs) {
                
                    try{
                
                        assert.equal(null, err);
                        assert.equal(0, docs.length);
                        res.send({message:"Users not Found"})
                    
                    }catch (error){

                        console.log(docs);
                        
                        res.send(docs)
                    
                    }    
                });    
            }catch{


            }
        });    
                
        
    } else {
            
        res.send({"error":1,"Descripcion":"Verifique el valor pasado"});
    }
    
    //next() 
   
})



module.exports = rutas;