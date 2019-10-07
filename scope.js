// async function prueba(){

//     await setTimeout(() => {
//              primera(1);
            
            
//     }, 2000);

// }

async function primera(a) {
    
    a = a + 1;
    return a;
}

function segunda(b){

    b = b + 1;
    return b;
}

 async function main (){

    var nro1 = await primera(0);
    var nro2 = segunda(nro1);

    console.log(nro1);
    console.log(nro2);

}

main();