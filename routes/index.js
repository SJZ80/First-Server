const express = require('express'),
      rutas = express.Router(),
      path = require('path'),
    //   usuarios = [{"nombre":"Diego","apellido":"Rosellini","edad":41,"password":"pepe"},
    //               {"nombre":"Nico","apellido":"Chialvo","edad":35,"password":"pepe1"},
    //               {"nombre":"Andres","apellido":"Salinero","edad":58,"password":"pepe2"}],
      jwt =require('jsonwebtoken'),
      key = require('../config'),
      assert = require('assert'),
      DATABASE = require('../database'),
      bcrypt = require('bcrypt');       

//Generate Token
rutas.post('/token',(req,res,next)=>{

    const { username,password} = req.body;

    console.log( username,password );
    
   
    DATABASE.client.connect(function(err, client) {
            
        try{
        
            assert.equal(null, err);
            console.log("Connected correctly to server");
            
            const db = DATABASE.client.db(DATABASE.DATABASE)
               
            db.collection('user').find({"nombre":username}).limit(1).toArray(function(err, docs) {
            
                try{
                    console.log(docs)
                    assert.equal(null, err);
                    assert.equal(1, docs.length);
                    
                    // Load hash from your password DB.
                    bcrypt.compare(password, docs[0].password,(err,resp)=>{
                         
                        try {
                                                
                            assert.equal(true,resp);
                            
                            //Generate Token
                            const token = jwt.sign({usuario:username},key.secretkey,{expiresIn: 60 * 60 * 24});
                                               
                            res.send({'token':token});
                            
                            next();

                        } catch (error) {

                            res.send({'message':'Verify password entered'})
                            next();
                            
                        }
                        
                    });

                }catch (error){

                    res.send({message:'Not exist User'});
                    next();
                
                }    
            });    
        
        }catch{

            console.log("Connection refused!!!");

        }
    })
    
     
   // next()
   
})

// Add User
rutas.post('/user/add',(req,res,next)=>{

    const {nombre,apellido,edad,password} = req.body;
    var usuario = {nombre:nombre,apellido:apellido,edad:edad,password:password};    
           
    //Encrpyt password
    bcrypt.hash(password, 10, function(err, hash) {

            if (hash) {
                
                usuario.password = hash
                                
            }
      });
    
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

//Find Single User
rutas.get('/user/:username',(req,res,next)=>{

    
    DATABASE.client.connect(function(err, client) {
            
        try{
        
            assert.equal(null, err);
            console.log("Connected correctly to server");
            
            const db = DATABASE.client.db(DATABASE.DATABASE)
               
            db.collection('user').find({"nombre":req.params.username}).limit(1).toArray(function(err, docs) {
            
                try{
            
                    assert.equal(null, err);
                    assert.equal(1, docs.length);
                    
                    res.send(docs);
                    next();

                }catch (error){

                    res.send({message:'Not exist User'});
                    next();
                
                }    
            });    
        
        }catch{

            console.log("Connection refused!!!");

        }
    })
   
})

//List of Users
rutas.post('/user/listusers',(req,res,next)=>{

   
    const {usuario} = req.body;

    console.log(usuario);
    
    
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

rutas.get('/sql',(req,res,next)=>{

       res.render('editor.ejs');

})

rutas.get('/articulo/:largenumber',(req,res,next)=>{

    DATABASE.client.connect(function(err, client) {
            
        try{
        
            assert.equal(null, err);
            console.log("Connected correctly to server");
            
            const db = DATABASE.client.db(DATABASE.DATABASE)
               
            db.collection('articulos').find({"nroArt":req.params.largenumber}).limit(1).toArray(function(err, docs) {
            
                try{
            
                    assert.equal(null, err);
                    assert.equal(1, docs.length);

                    console.log(docs);
                                        
                    //res.send(docs);
                    res.render('articulos.ejs',docs[0])

                    next();

                }catch (error){

                    //res.send({message:'Not exist User'});
                    res.render('articulonocatalogado.ejs')
                    next();
                
                }    
            });    
        
        }catch{

            console.log("Connection refused!!!");

        }
    })



   // res.render('articulos.ejs',{ pat: '../../a.jpg' });

})

rutas.get('/articulo',(req,res,next)=>{

    res.render('articulonocatalogado.ejs')
    next();
               
})

module.exports = rutas;