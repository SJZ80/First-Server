let prom:Promise<any> = new Promise<any>(function(resolve,reject){

    setTimeout(()=>{

        console.log("Promesa Terminada!!!");

        //Termina Bien
        //resolve("Esta ok");
        
        //Termina Mal
         reject("Termina Mal");

    },1500);

})

console.log("Paso 1");

prom.then((respuesta:string)=>{

       //Hago algo con los datos devueltos
       console.log(respuesta," Silvio Resolve");
    })
    .catch((error:string)=>{

        console.error(error,"Silvio Reject");
        

    })
console.log("Paso 2");
